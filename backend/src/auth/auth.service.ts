import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/user/users.service';

@Injectable()
export class AuthService {
	constructor(private usersService: UsersService) {}

	async validateUser(token :string, login:string): Promise<any>
	{
		console.log("Token from 42 : " + token)
		console.log("Login from 42 : " + login)
		let user = await this.usersService.findOneByLogin(login);
		if (user && user.token !== token) {
			console.log("Token different !")
			user = await this.usersService.changetoken(login, token);
	  	}
	  	if (user && user.token === token) {
			console.log("Token is fine !")
	  	}
	  	if (!user) {
			user = await this.usersService.create(login, token);
	  	}
		const { ...result } = user;
		return result;
	}
}
