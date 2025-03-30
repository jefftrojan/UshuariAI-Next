import { RoomServiceClient, DataPacket_Kind } from 'livekit-server-sdk';
import OpenAI from 'openai';

export class SchedulerAgent {
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
            content: "You are a scheduling assistant helping users schedule legal consultations. Help them find suitable time slots and manage appointments."
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
          type: 'scheduler_response',
          data: response,
          timestamp: Date.now()
        })),
        DataPacket_Kind.RELIABLE
      );

      return response;
    } catch (error) {
      console.error('Error in SchedulerAgent:', error);
      throw error;
    }
  }
} 