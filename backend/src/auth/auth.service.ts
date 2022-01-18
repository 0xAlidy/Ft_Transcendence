import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/user/users.service';

@Injectable()
export class AuthService {
	constructor(private usersService: UsersService) {}

	async validateUser(token :string, username:string): Promise<any> {
		console.log(token+"eeeeeeeei"+ username);
	  const user = await this.usersService.findOneByName(username);
	console.log(user)
	if (user && user.token !== token) {
		this.usersService.changetoken(username, token);
		const { ...result } = user;
		return result;
	  }
	  if (user && user.token === token) {
		const { ...result } = user;
		return result;
	  }
	  if (!user) {
		const ret = await this.usersService.create(username, token);
		const { ...result } = ret;
		console.log(result);
		return result;
	  }
	  return null;
	}
}
