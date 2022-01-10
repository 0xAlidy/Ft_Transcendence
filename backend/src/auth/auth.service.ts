import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/auth/user/users.service';

@Injectable()
export class AuthService {
	constructor(private usersService: UsersService) {}

	async validateUser(token :string): Promise<any> {
	  const user = await this.usersService.findOne(token);
	  if (user && user.token === token) {
		const { ...result } = user;
		return result;
	  }
	  return null;
	}
}
