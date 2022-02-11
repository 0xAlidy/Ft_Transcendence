import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PrivRoomService } from './PrivRoom.service';
@Controller('/ChatRooms')

export class PrivRoomController {
    constructor(private readonly PrivRoomService:PrivRoomService) { }
    @Post('/message')
    async msg(@Body() data:any){
        this.PrivRoomService.addMessage(data)
    }

}
