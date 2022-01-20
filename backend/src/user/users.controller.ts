import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import axios, { AxiosResponse } from 'axios';
import { UsersService } from './users.service';
import { MatchsService } from 'src/matchs/matchs.service';
@Controller('/user')
export class UsersController {
    constructor(private readonly UsersService: UsersService,private readonly matchService: MatchsService) { }
    @Get('/updateWS')
    async getToken(@Query('token') token: string, @Query('ID') id: string)
    {
		await this.UsersService.changeWSId(token,id);
    }

    @Get('/meToken')
    async meToken(@Query('token') token: string)
    {
		  return await this.UsersService.findOne(token);
    }

    @Post('/upload')
    uploadFile(@Body() data:any) {
      console.log(data);
    }

    @Post('/generateSecret')
    async generateSecret(@Body() data:any)
    {
      return await this.UsersService.generateSecret(data);
    }

    @Post('/verifyNumber')
    async verifyNumber(@Body() data:any)
    {
      return await this.UsersService.verifyNumber(data);
    }

}
