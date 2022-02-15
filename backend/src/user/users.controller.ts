import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import axios, { AxiosResponse } from 'axios';
import { UsersService } from './users.service';
import { MatchsService } from 'src/matchs/matchs.service';
@Controller('/user')
export class UsersController {
    constructor(private readonly UsersService: UsersService) { }
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

    @Get('/nicknameAvailable')
    async nicknameAvailable(@Query('nickname') nickname: string) {
      return await this.UsersService.nicknameAvailable(nickname);
    }
    
    @Get('/getUser')
    async getUserPublic(@Query('token') token: string, @Query('name') name: string) {
      return await this.UsersService.getUserPublic(token, name);
    }

    @Post('/upload')
    async uploadFile(@Body() data:any) {
      return await this.UsersService.changeImgUrl(data);
    }

    @Post('/completeProfile')
    async completeProfile(@Body() data:any) {
      return await this.UsersService.completeProfile(data);
    }

    @Post('/changeNickname')
    async changeNickname(@Body() data:any)
    {
      await this.UsersService.changeNickname(data);
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

    @Post('secretEnabled')
    async secretEnabled(@Body() data:any)
    {
      return await this.UsersService.secretEnabled(data);
    }
}
