import { Controller, Get, Query } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import axios, { AxiosResponse } from 'axios';
import { UsersService } from './auth/user/users.service';
@Controller('/app')
export class AppController {
    constructor(private readonly httpService: HttpService, private readonly UsersService: UsersService) { }
}
