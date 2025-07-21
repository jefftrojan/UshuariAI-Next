import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Lazy initialization to avoid build-time errors
let openai: OpenAI | null = null;

function getOpenAI() {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

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
    const response = await getOpenAI().audio.speech.create({
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