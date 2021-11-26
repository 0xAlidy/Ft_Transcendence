import { Controller, Get, Query } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import axios, { AxiosResponse } from 'axios';

@Controller('/app')
export class AppController {
    constructor(private readonly httpService: HttpService) { }
    @Get('/token')
    async getToken(@Query('code') code: string)
    {
        let resp;
        let user;
        const headersRequest = {
            Authorization: ` Bearer`,
        };
        const data = {
            grant_type: 'authorization_code',
            client_id: 'd42d44ee8052b31b332b4eb135916c028f156dbb4d3c7e277030f3b2bc08d87c',
            client_secret: '516c1e7a1740a373e17e3c9479a383135671934c408e191cd7aec9b0a996f10e',
            code: code,
            redirect_uri: 'http://localhost:3000/auth/'
        }
        try{
            resp = await this.httpService
            .post('https://api.intra.42.fr/oauth/token/', data)
			.toPromise();
        }
        catch(error){
            console.log("Invalid auth")
            return ('error');
        }
        try{
            user = await this.httpService
            .get('https://api.intra.42.fr/v2/me', { headers: { Authorization: `Bearer ${resp.data.access_token}`}})
            .toPromise();
        }
        catch(error){
            console.log("Invalid auth")
            return ('error');
        }
        console.log(user.data);
        return(resp.data.access_token);
    }
}
