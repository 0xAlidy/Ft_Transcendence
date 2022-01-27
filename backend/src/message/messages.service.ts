import { forwardRef, Inject, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "src/user/users.service";
import {getRepository, Repository} from "typeorm";
import {Message} from "./message.entity";

 // you can also get it via getConnection().getRepository() or getManager().getRepository()

@Injectable()
export class MessagesService
{
	private logger: Logger = new Logger('UsersService');
	constructor(@InjectRepository(Message) private MatchRepository: Repository<Message>){
	}
	async create(sender :string, dest:string, message:string, date:string) {
		var match = new Message(sender, dest, message, date)
		this.MatchRepository.save(match);
	}

}
