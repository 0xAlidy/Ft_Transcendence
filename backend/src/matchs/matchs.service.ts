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
	async create(WinnerName :string, WinnerScore:number, LooserName:string, LooserScore:number, isarcade:boolean) {
		var match = new Match(WinnerName , WinnerScore, LooserName, LooserScore, isarcade)
		this.MatchRepository.save(match);
	}

	async MatchsByName(token:string, login:string)
	{
		var me = await this.usersService.findOne(token);
		if (me)
		{
			var array = await this.MatchRepository.find();
			var askerMatchs:Match[] = [];
			var ret:string[] = [];
			array.forEach(element => {
				if (element.WinnerName === login || element.LooserName === login)
					askerMatchs.push(element);
			});
			askerMatchs.forEach(element => {
				ret.push(element.WinnerName +'/'+ element.WinnerScore	+'/'+ element.LooserName +'/'+ element.LooserScore + '/' + (element.isArcade ? 'true': 'false'));
			});
			return ret;
		}
		return null;
	}
}
