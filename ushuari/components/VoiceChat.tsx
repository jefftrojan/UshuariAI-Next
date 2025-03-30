import { useState, useEffect, useRef } from 'react';
import { 
  useLocalParticipant, 
  useRemoteParticipants, 
  useDataChannel,
  LiveKitRoom,
} from '@livekit/components-react';
import { DataPacket_Kind, Room, RemoteParticipant, LocalParticipant, createLocalTracks } from 'livekit-client';

interface Message {
  type: 'legal_response' | 'scheduler_response' | 'document_response';
  data: string;
  language: string;
  timestamp: number;
}

interface VoiceChatProps {
  onCallRecorded: (audioBlob: Blob, transcript: string) => void;
  roomName?: string;
  isInitialized?: boolean;
}

// Separate component for handling data channels inside LiveKitRoom
function VoiceChatContent({ onCallRecorded, roomName, isInitialized }: VoiceChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<AudioBuffer[]>([]);
  const isPlayingRef = useRef(false);

  // Initialize audio context only after user interaction
  useEffect(() => {
    if (isInitialized && !audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      audioContextRef.current.resume();
    }
  }, [isInitialized]);

  // Cleanup audio context
  useEffect(() => {
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  // Handle incoming data messages
  // Handle incoming data messages
// Handle incoming data messages
useDataChannel((msg) => {
    try {
      const decodedString = new TextDecoder().decode(msg.data);
      
      // Log the raw message for debugging
      console.log('Received data channel message:', decodedString);
      
      // Skip empty messages
      if (!decodedString || decodedString.trim() === '') {
        console.log('Skipping empty message');
        return;
      }
      
      const data = JSON.parse(decodedString);
      
      setMessages(prev => [...prev, {
        ...data,
        timestamp: Date.now()
      }]);
  
      // Convert text to speech and play it
      if (data.type && data.data) {
        playTextToSpeech(data.data);
      }
    } catch (error) {
      console.error('Error decoding message:', error);
      console.error('Raw message data:', msg.data);
    }
  });

  // Play text to speech
  const playTextToSpeech = async (text: string) => {
    try {
      if (!isInitialized || !audioContextRef.current) {
        console.warn('Audio context not initialized');
        return;
      }

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          language: 'en',
        }),
      });

      if (!response.ok) throw new Error('TTS request failed');

      const audioBlob = await response.blob();
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      
      audioQueueRef.current.push(audioBuffer);
      
      if (!isPlayingRef.current) {
        playNextInQueue();
      }
    } catch (error) {
      console.error('Error playing TTS:', error);
    }
  };

  // Play next audio in queue
  const playNextInQueue = async () => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }

    isPlayingRef.current = true;
    const audioBuffer = audioQueueRef.current.shift()!;
    const source = audioContextRef.current!.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current!.destination);
    source.onended = playNextInQueue;
    source.start(0);
  };

  // Start recording
  const startRecording = async () => {
    try {
      if (!isInitialized || !audioContextRef.current) {
        console.warn('Audio context not initialized');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await sendAudioToAgent(audioBlob);
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsProcessing(false);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Send audio to agent
  const sendAudioToAgent = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      
      // Convert audio to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        
        // Send to API endpoint
        const response = await fetch('/api/voice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            audio: base64Audio,
            agentType: 'legal',
            language: 'en',
            roomName,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error(errorData.error || 'Failed to send audio to agent');
        }

        const data = await response.json();
        if (!data.response) {
          throw new Error('No response from agent');
        }
        
        onCallRecorded(audioBlob, data.response);
        setIsProcessing(false);
      };
    } catch (error) {
      console.error('Error sending audio to agent:', error);
      setIsProcessing(false);
      // Show error to user
      setMessages(prev => [...prev, {
        type: 'legal_response',
        data: 'Sorry, there was an error processing your audio. Please try again.',
        language: 'en',
        timestamp: Date.now()
      }]);
    }
  };

  return (
    <div className="flex flex-col h-full p-4">
      {/* Recording Controls */}
      <div className="mb-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`px-4 py-2 rounded ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600' 
              : isProcessing
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600'
          } text-white transition-colors duration-200`}
        >
          {isRecording ? 'Stop Recording' : isProcessing ? 'Processing...' : 'Start Recording'}
        </button>
      </div>

      {/* Messages Display */}
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className="p-2 mb-2 rounded bg-blue-900/30"
          >
            <div className="font-bold text-white/80">Legal Assistant</div>
            <div className="text-white">{message.data}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main VoiceChat component
export function VoiceChat({ onCallRecorded }: VoiceChatProps) {
  const [token, setToken] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [roomName, setRoomName] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize room name and audio context
  useEffect(() => {
    const newRoomName = `room-${Date.now()}`;
    setRoomName(newRoomName);
    console.log('Initialized room name:', newRoomName);

    // Initialize audio context on user interaction
    const initAudio = async () => {
      try {
        const audioContext = new AudioContext();
        await audioContext.resume();
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing audio context:', error);
      }
    };

    // Add click listener to initialize audio
    document.addEventListener('click', initAudio, { once: true });
    return () => document.removeEventListener('click', initAudio);
  }, []);

  // Get LiveKit token
  useEffect(() => {
    const getToken = async () => {
      if (!roomName) return;
      
      try {
        console.log('Getting token for room:', roomName);
        const participantName = `user-${Date.now()}`;
        const response = await fetch(
          `/api/voice?roomName=${encodeURIComponent(roomName)}&participantName=${encodeURIComponent(participantName)}`
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Token request failed:', errorData);
          throw new Error('Failed to get token');
        }
        
        const data = await response.json();
        console.log('Token received successfully');
        
        // Store both token and serverUrl from the response
        setToken(data.token);
        setServerUrl(data.serverUrl);
      } catch (error) {
        console.error('Error getting token:', error);
        setError('Failed to get connection token');
      }
    };

    getToken();
  }, [roomName]);

  // Use the LiveKitRoom component approach for simplicity and reliability
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white bg-red-500/20 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!token || !serverUrl) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white">Connecting to voice chat...</div>
      </div>
    );
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={true}
      onError={(error) => {
        console.error('LiveKit connection error:', error);
        setIsConnected(false);
        setError('Failed to connect to voice chat: ' + error.message);
      }}
      onConnected={() => {
        console.log('Connected to LiveKit room');
        setIsConnected(true);
        setError(null);
      }}
      onDisconnected={() => {
        console.log('Disconnected from LiveKit room');
        setIsConnected(false);
      }}
      options={{
        adaptiveStream: true,
        dynacast: true,
        stopLocalTrackOnUnpublish: true,
      }}
    >
      <VoiceChatContent 
        onCallRecorded={onCallRecorded} 
        roomName={roomName}
        isInitialized={isInitialized}
      />
    </LiveKitRoom>
  );
}