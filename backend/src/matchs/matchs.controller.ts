import { Controller, Get, Query } from '@nestjs/common';
import { MatchsService } from 'src/matchs/matchs.service';
@Controller('/matchs')
export class MatchsController {
    constructor(private readonly matchService: MatchsService) { }
    @Get()
    async myMatchs(@Query('token') token:string, @Query('login') login:string)
    {
        return await this.matchService.MatchsByName(token, login);
    }
}
