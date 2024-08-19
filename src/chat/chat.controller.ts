import { Controller, Get, Render } from '@nestjs/common';

@Controller('chat')
export class ChatController {
  @Get()
  @Render('index')
  getChat() {
    return { message: 'Welcome to the chat application!' };
  }
}
