import { Injectable, Logger} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "src/user/users.service";
import { Repository } from "typeorm";
import { PrivRoom } from './PrivRoom.entity';
import { createCipheriv, randomBytes} from 'crypto';
import { createDecipheriv } from 'crypto';
import { Message } from '../message/message.entity';
import { clientClass } from "src/chat/class/client.class";
import { Client } from 'socket.io/dist/client';
import { ChatRoomsService } from '../ChatRooms/ChatRooms.service';

@Injectable()
export class PrivRoomService
{
    private logger: Logger = new Logger('PrivRoomService');
    constructor(@InjectRepository(PrivRoom) private PrivRoomRepository: Repository<PrivRoom>, private chatRooms:ChatRoomsService, private userService:UsersService){
	}

    async findRoomByName(user2:string){
        return await this.PrivRoomRepository.findOne(
            { where:
                { user2: user2 }
            })
    }

    async create(user1:string, user2:string){
        var privRoom = new privRoom(user1,user2)
        await this.PrivRoomRepository.save(privRoom);
    }

    async addMessage(data:any)
    {
        var room = await this.findRoomByName(data.dest)
        room.messages.push(data)
        this.PrivRoomRepository.save(room)
    }
}