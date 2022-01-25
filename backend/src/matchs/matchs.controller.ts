import { Controller, Get, Query } from '@nestjs/common';
import { MatchsService } from 'src/matchs/matchs.service';
@Controller('/matchs')
export class MatchsController {
    constructor(private readonly matchService: MatchsService) { }
    @Get()
    async myMatchs(@Query('name') name:string, @Query('token') token:string)
    {
        return await this.matchService.MatchsByName(name, token);
    }
}
