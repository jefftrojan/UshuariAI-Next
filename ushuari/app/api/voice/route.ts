import { NextRequest, NextResponse } from 'next/server';
import { AgentCoordinator } from '@/lib/agents';
import { Conversation } from '@/models/Conversation';
import { connectToDatabase } from '@/lib/mongodb';
import OpenAI from 'openai';
import { AccessToken } from 'livekit-server-sdk';

const coordinator = new AgentCoordinator();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { audio, agentType, language, roomName } = await req.json();

    if (!audio || !agentType || !language || !roomName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Convert base64 audio to buffer
    const audioBuffer = Buffer.from(audio.split(',')[1], 'base64');

    // Transcribe audio using OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: new File([audioBuffer], 'audio.wav', { type: 'audio/wav' }),
      model: 'whisper-1',
      language: language,
    });

    // Handle the message
   // In your route.ts file
const response = await coordinator.handleMessage(
  roomName,             // First parameter should be roomName
  transcription.text,   // Second parameter should be the message
  agentType             // Third parameter should be the agent type
);

    // Store conversation in database
    await Conversation.findOneAndUpdate(
      { roomName, status: 'active' },
      {
        $push: {
          messages: [
            {
              type: 'user',
              content: transcription.text,
              audioUrl: audio, // Store base64 audio
            },
            {
              type: `${agentType}_response`,
              content: response,
            },
          ],
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error('Error processing audio:', error);
    return NextResponse.json(
      { error: 'Failed to process audio' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const roomName = searchParams.get('roomName');
    const participantName = searchParams.get('participantName');

    if (!roomName || !participantName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
      console.error('Missing LiveKit credentials');
      return NextResponse.json(
        { error: 'LiveKit credentials not configured' },
        { status: 500 }
      );
    }

    console.log('Generating token for:', { roomName, participantName });

    // Create a new access token
    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      {
        identity: participantName,
        name: participantName,
        ttl: 60 * 60 * 2, // 2 hours
      }
    );

    // Add permissions for the room
    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      roomAdmin: true,
      roomCreate: true,
      roomList: true,
    });

    // Generate the token - AWAIT IT since it's a Promise
    const token = await at.toJwt();
    console.log('Token generated successfully');
    console.log('Generated token type:', typeof token);
    console.log('Generated token',  token);

    // Ensure we're using the correct server URL format
    const serverUrl = process.env.LIVEKIT_URL || 'wss://doormate-tl2uygau.livekit.cloud';
    if (!serverUrl.startsWith('wss://')) {
      console.error('Invalid server URL format:', serverUrl);
      return NextResponse.json(
        { error: 'Invalid server URL configuration' },
        { status: 500 }
      );
    }
    
    console.log('Server URL being sent:', serverUrl);

    return NextResponse.json({ 
      token,
      serverUrl
    });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
}