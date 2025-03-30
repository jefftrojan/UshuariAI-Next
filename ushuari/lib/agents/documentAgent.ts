import { RoomServiceClient, DataPacket_Kind } from 'livekit-server-sdk';
import OpenAI from 'openai';

export class DocumentAgent {
  private openai: OpenAI;
  private roomService: RoomServiceClient;

  constructor(roomService: RoomServiceClient) {
    this.roomService = roomService;
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async handleMessage(roomName: string, message: string) {
    try {
      // Process the message with OpenAI
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a document management assistant helping users with legal document preparation, review, and management. Help them understand and handle legal documents effectively."
          },
          {
            role: "user",
            content: message
          }
        ],
      });

      const response = completion.choices[0].message.content || "I apologize, but I couldn't process your request.";

      // Send the response back through LiveKit
      await this.roomService.sendData(
        roomName,
        new TextEncoder().encode(JSON.stringify({
          type: 'document_response',
          data: response,
          timestamp: Date.now()
        })),
        DataPacket_Kind.RELIABLE
      );

      return response;
    } catch (error) {
      console.error('Error in DocumentAgent:', error);
      throw error;
    }
  }
} 