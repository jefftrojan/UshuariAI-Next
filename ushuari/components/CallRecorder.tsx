// components/CallRecorder.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";

interface CallRecorderProps {
  onCallRecorded?: (audioBlob: Blob, transcript: string) => void;
  maxDuration?: number; // in seconds
}

export default function CallRecorder({
  onCallRecorded,
  maxDuration = 60,
}: CallRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [transcript, setTranscript] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up resources on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

      stopRecording();
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      setRecordingDuration(0);

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // In a real app, you would send the audio to a speech-to-text service
        // For this demo, we'll simulate a transcript
        const mockTranscript =
          "This is a simulated transcript of the legal question. In a real application, this would be the result of processing the audio through a speech-to-text service.";
        setTranscript(mockTranscript);

        if (onCallRecorded) {
          onCallRecorded(audioBlob, mockTranscript);
        }

        // Stop all audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => {
          if (prev >= maxDuration - 1) {
            stopRecording();
            return maxDuration;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error(
        "Unable to access your microphone. Please check your browser permissions."
      );
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsRecording(false);
  };

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSubmit = () => {
    if (audioUrl && transcript) {
      fetch(audioUrl)
        .then((res) => res.blob())
        .then((blob) => {
          if (onCallRecorded) {
            onCallRecorded(blob, transcript);
            toast.success("Your legal inquiry has been submitted!");
            setAudioUrl(null);
            setTranscript("");
          }
        });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium mb-4">Record Your Legal Question</h3>

      <div className="flex flex-col space-y-4">
        {/* Audio visualization or player */}
        <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center">
          {audioUrl ? (
            <audio src={audioUrl} controls className="w-full h-10" />
          ) : (
            <div className="flex items-center justify-center h-full">
              {isRecording ? (
                <div className="text-red-500 animate-pulse">
                  Recording... {formatTime(recordingDuration)}
                </div>
              ) : (
                <div className="text-gray-400">
                  Press the button below to start recording
                </div>
              )}
            </div>
          )}
        </div>

        {/* Transcript display */}
        {transcript && (
          <div className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Transcript:
            </h4>
            <p className="text-gray-600 text-sm">{transcript}</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          {!audioUrl ? (
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-4 rounded-full ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white focus:outline-none shadow-md`}
            >
              {isRecording ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <rect x="6" y="6" width="12" height="12" strokeWidth="2" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              )}
            </button>
          ) : (
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setAudioUrl(null);
                  setTranscript("");
                  setRecordingDuration(0);
                }}
                className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 focus:outline-none shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-md focus:outline-none flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Submit Question
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
