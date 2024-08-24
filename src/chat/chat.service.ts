import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatEntity } from './chat.entity';
// import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
    // private readonly configService: ConfigService,
  ) {}

  async saveMessage(
    sender: string,
    content: string,
    group: string,
  ): Promise<ChatEntity> {
    const newMessage = this.chatRepository.create({
      sender,
      content,
      group,
      type: 'text'
    });
    return this.chatRepository.save(newMessage);
  }

  async saveFile(
    sender: string,
    content: string,
    group: string,
  ): Promise<ChatEntity> {
    const newMessage = this.chatRepository.create({
      sender,
      content,
      group,
      type: content.split(';')[0].split(':')[1],
    });
    return this.chatRepository.save(newMessage);
  }

  async getMessagesByGroup(group: string): Promise<ChatEntity[]> {
    return this.chatRepository.find({
      where: { group },
      order: { createdAt: 'ASC' },
    });
  }
}
