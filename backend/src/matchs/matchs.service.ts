import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {getRepository, Repository} from "typeorm";
import {Match} from "./match.entity";

 // you can also get it via getConnection().getRepository() or getManager().getRepository()

@Injectable()
export class MatchsService {
  private logger: Logger = new Logger('UsersService');
  constructor(
    @InjectRepository(Match)
    private MatchRepository: Repository<Match>){
  }
  async create(WinnerName :string, WinnerScore:number, LooserName:string, LooserScore:number) {
    var match = new Match(WinnerName , WinnerScore, LooserName, LooserScore)
    this.MatchRepository.save(match);
  }

  async MatchsByName(name:string)
  {
    var array = await this.MatchRepository.find();
    var ret:Match[] = [];
    array.forEach(element => {
      if (element.WinnerName === name || element.LooserName === name)
        ret.push(element);
    });
    return ret;
  }
}
