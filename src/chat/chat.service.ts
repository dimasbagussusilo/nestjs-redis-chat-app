import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
// import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    // private readonly configService: ConfigService,
  ) {}

  async saveMessage(
    sender: string,
    message: string,
    group: string,
  ): Promise<Message> {
    const newMessage = this.messageRepository.create({
      sender,
      message,
      group,
    });
    return this.messageRepository.save(newMessage);
  }

  async getMessagesByGroup(group: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: { group },
      order: { createdAt: 'ASC' },
    });
  }
}
