import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';
@Controller('/messages')
export class MessagesController {
    constructor(private readonly messageService:MessagesService) { }

    @Post()
    async myMatchs(@Body() data:any)
    {
        this.messageService.create(data.sender, data.dest, data.message, data.string)
    }
}
