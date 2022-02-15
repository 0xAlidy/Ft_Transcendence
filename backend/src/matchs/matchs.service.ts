import { forwardRef, Inject, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "src/user/users.service";
import {getRepository, Repository} from "typeorm";
import {Match} from "./match.entity";

 // you can also get it via getConnection().getRepository() or getManager().getRepository()

@Injectable()
export class MatchsService
{
	private logger: Logger = new Logger('UsersService');
	constructor(@InjectRepository(Match) private MatchRepository: Repository<Match>, private usersService: UsersService){
	}
	async create(WinnerName :string, WinnerScore:number, LooserName:string, LooserScore:number) {
		var match = new Match(WinnerName , WinnerScore, LooserName, LooserScore)
		this.MatchRepository.save(match);
	}

	async MatchsByName(token:string)
	{
		var user = await this.usersService.findOne(token);
		if (user)
		{
			var array = await this.MatchRepository.find();
			var askerMatchs:Match[] = [];
			var ret:string[] = [];
			array.forEach(element => {
				if (element.WinnerName === user.login || element.LooserName === user.login)
					askerMatchs.push(element);
			});
			askerMatchs.forEach(element => {
				ret.push(element.WinnerName +'/'+ element.WinnerScore	+'/'+ element.LooserName +'/'+ element.LooserScore);
			});
			return ret;
		}
		return null;
	}
}
