/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { Room } from './class/Room.class';

@Module({
    imports: [ChatGateway],
    controllers: [],
    providers: [],
})
export class ChatModule { }
