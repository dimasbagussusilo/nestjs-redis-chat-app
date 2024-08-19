import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private readonly redisService: RedisService,
    private readonly chatService: ChatService,
    private readonly configService: ConfigService,
  ) {}

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  async handleMessage(
    client: Socket,
    payload: { sender: string; message: string; group: string },
  ) {
    const message = {
      sender: payload.sender,
      message: payload.message,
      group: payload.group,
    };
    await this.chatService.saveMessage(
      payload.sender,
      payload.message,
      payload.group,
    );
    await this.redisService.publish(
      `chat:${payload.group}`,
      JSON.stringify(message),
    );
  }

  @SubscribeMessage('joinGroup')
  async handleJoinGroup(client: Socket, payload: { group: string }) {
    client.join(payload.group);
    console.log(`Client ${client.id} joined group: ${payload.group}`);

    // Send chat history to the client
    const messages = await this.chatService.getMessagesByGroup(payload.group);
    client.emit('chatHistory', messages);
  }

  async onModuleInit() {
    const groups = ['group1', 'group2', 'group3']; // Define your groups here
    for (const group of groups) {
      await this.redisService.subscribe(`chat:${group}`, (message) => {
        const parsedMessage = JSON.parse(message);
        this.server.to(parsedMessage.group).emit('message', parsedMessage);
      });
    }
  }
}
