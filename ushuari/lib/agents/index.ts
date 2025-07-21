import { AccessToken, RoomServiceClient, Room } from 'livekit-server-sdk';
import { LegalAgent } from './legalAgent';
import { SchedulerAgent } from './schedulerAgent';
import { DocumentAgent } from './documentAgent';

export class AgentCoordinator {
  private legalAgent: LegalAgent | null = null;
  private schedulerAgent: SchedulerAgent | null = null;
  private documentAgent: DocumentAgent | null = null;
  private roomService: RoomServiceClient | null = null;

  private getRoomService() {
    if (!this.roomService) {
      this.roomService = new RoomServiceClient(
        process.env.LIVEKIT_HOST!,
        process.env.LIVEKIT_API_KEY!,
        process.env.LIVEKIT_API_SECRET!
      );
    }
    return this.roomService;
  }

  private getLegalAgent() {
    if (!this.legalAgent) {
      this.legalAgent = new LegalAgent(this.getRoomService());
    }
    return this.legalAgent;
  }

  private getSchedulerAgent() {
    if (!this.schedulerAgent) {
      this.schedulerAgent = new SchedulerAgent(this.getRoomService());
    }
    return this.schedulerAgent;
  }

  private getDocumentAgent() {
    if (!this.documentAgent) {
      this.documentAgent = new DocumentAgent(this.getRoomService());
    }
    return this.documentAgent;
  }

  async handleMessage(roomName: string, message: string, agentType: string) {
    switch (agentType) {
      case 'legal':
        return this.getLegalAgent().handleMessage(roomName, message);
      case 'scheduler':
        return this.getSchedulerAgent().handleMessage(roomName, message);
      case 'document':
        return this.getDocumentAgent().handleMessage(roomName, message);
      default:
        throw new Error(`Unknown agent type: ${agentType}`);
    }
  }

  generateToken(roomName: string, participantName: string) {
    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY || '',
      process.env.LIVEKIT_API_SECRET || '',
      {
        identity: participantName,
        name: participantName,
      }
    );

    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    });

    return at.toJwt();
  }
} 