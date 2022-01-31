/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ChatRoomsModule } from 'src/ChatRooms/ChatRooms.module';
import { MessagesModule } from 'src/message/messages.module';
import { UsersModule } from 'src/user/user.module';
import { ChatGateway } from './chat.gateway';
import { Room } from './class/Room.class';

@Module({
    imports: [ChatRoomsModule, UsersModule],
    controllers: [],
    providers: [ChatGateway],
})
export class ChatModule { }
