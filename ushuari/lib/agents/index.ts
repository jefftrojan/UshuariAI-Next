import { AccessToken, RoomServiceClient, Room } from 'livekit-server-sdk';
import { LegalAgent } from './legalAgent';
import { SchedulerAgent } from './schedulerAgent';
import { DocumentAgent } from './documentAgent';

export class AgentCoordinator {
  private legalAgent: LegalAgent;
  private schedulerAgent: SchedulerAgent;
  private documentAgent: DocumentAgent;
  private roomService: RoomServiceClient;

  constructor() {
    this.roomService = new RoomServiceClient(
      process.env.LIVEKIT_HOST!,
      process.env.LIVEKIT_API_KEY!,
      process.env.LIVEKIT_API_SECRET!
    );
    this.legalAgent = new LegalAgent(this.roomService);
    this.schedulerAgent = new SchedulerAgent(this.roomService);
    this.documentAgent = new DocumentAgent(this.roomService);
  }

  async handleMessage(roomName: string, message: string, agentType: string) {
    switch (agentType) {
      case 'legal':
        return this.legalAgent.handleMessage(roomName, message);
      case 'scheduler':
        return this.schedulerAgent.handleMessage(roomName, message);
      case 'document':
        return this.documentAgent.handleMessage(roomName, message);
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