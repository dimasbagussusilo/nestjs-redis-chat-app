import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { RedisModule } from '../redis/redis.module';
import { ChatEntity } from './chat.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatEntity]),
    RedisModule,
  ],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
