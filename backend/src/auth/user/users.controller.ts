import { Controller, Get, Query } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import axios, { AxiosResponse } from 'axios';
import { UsersService } from './users.service';
@Controller('/user')
export class UsersController {
    constructor(private readonly UsersService: UsersService) { }
    @Get('/updateWS')
    async getToken(@Query('token') token: string, @Query('ID') id: string)
    {
		  this.UsersService.changeWSId(token,id);
    }

    @Get('/meToken')
    async meToken(@Query('token') token: string)
    {
		  return await this.UsersService.findOne(token);
    }

}
