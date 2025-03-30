import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { text, language } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Map language codes to voices
    const voiceMap: Record<string, string> = {
      en: 'alloy',
      sw: 'alloy',
      rw: 'alloy',
    };

    // Generate speech using OpenAI's TTS
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: voiceMap[language] || 'alloy',
      input: text,
    });

    // Convert the response to a buffer
    const buffer = await response.arrayBuffer();

    // Return the audio data
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('Error generating speech:', error);
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    );
  }
} 