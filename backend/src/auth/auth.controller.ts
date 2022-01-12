import { Controller, Get, HttpStatus, Post, Redirect, Req, Request, Res, UseGuards, Response } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import querystring from 'querystring'
import { UsersService } from './user/users.service';

@Controller('/auth')
export class AuthController {
    constructor(private readonly UsersService: UsersService) { }

	@UseGuards(AuthGuard("42"))
	@Post('login')
	login(@Request() req):any{
		return req.user;
	}

	@Get()
	saybute()
	{
		console.log('bute');
	}

	@Get("/redirect")
	@UseGuards(AuthGuard("42"))
	async FTLoginRedirect(@Req() req: any, @Res() res:any): Promise<any> {
		console.log(req.user.name +"    "+ req.user.token );
        this.UsersService.create(req.user.name, req.user.token);
	  return res.redirect('http://localhost:3000/auth'+ '?token='+ req.user.token+'&name='+ req.user.name);
		}
}
