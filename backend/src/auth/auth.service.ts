import { Injectable } from "@nestjs/common";
import { UsersService } from "src/user/users.service";

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async validateUser(token :string, login:string): Promise<any>
    {
        let user = await this.usersService.findOneByLogin(login);
		if (!user) {
            user = await this.usersService.create(login, token);
        }
        else{
            if (user.status !== 0)
                return null;
            if (user.token !== token)
                user = await this.usersService.changetoken(login, token);
        }
        const { ...result } = user;
        return result;
    }
}