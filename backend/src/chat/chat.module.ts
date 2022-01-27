/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { MessagesModule } from 'src/message/messages.module';
import { ChatGateway } from './chat.gateway';
import { Room } from './class/Room.class';

@Module({
    imports: [MessagesModule],
    controllers: [],
    providers: [ChatGateway],
})
export class ChatModule { }
