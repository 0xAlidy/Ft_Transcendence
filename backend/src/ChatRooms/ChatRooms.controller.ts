import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ChatRoomsService } from './ChatRooms.service';
@Controller('/ChatRooms')
export class ChatRoomsController {
    constructor(private readonly ChatRoomsService:ChatRoomsService) { }
    @Post('/message')
    async msg(@Body() data:any){
        this.ChatRoomsService.addMessage(data)
    }

}
