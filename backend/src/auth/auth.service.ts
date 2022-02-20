import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/user/users.service';

@Injectable()
export class AuthService {
	constructor(private usersService: UsersService) {}

	async validateUser(token :string, login:string): Promise<any>
	{
		console.log("Token from 42 : " + token)
		console.log("Login from 42 : " + login)
		const user = await this.usersService.findOneByLogin(login);
		if (user && user.token !== token) {
			console.log("Token different !")
			this.usersService.changetoken(login, token);
			const { ...result } = user;
			return result;
	  	}
	  	if (user && user.token === token) {
			console.log("Token is fine !")
			const { ...result } = user;
			return result;
	  	}
	  	if (!user) {
			const ret = await this.usersService.create(login, token);
			const { ...result } = ret;
			return result;
	  	}
	 	return null;
	}
}
