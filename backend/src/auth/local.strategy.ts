import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { AuthService } from "./auth.service"
import { Strategy, Profile } from "passport-42"

@Injectable()
export class FTStrategy extends PassportStrategy(Strategy, '42')
{
	constructor(private authServe: AuthService)
	{
		super({

			clientID: process.env.ID,
			clientSecret: process.env.SECRET,
			callbackURL: "http://" + process.env.IP + ":667/auth/redirect"
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: Profile, done: (err: any, user: any, info?: any) => void): Promise<any>
	{
		const user =  await this.authServe.validateUser(accessToken, profile.username)
		const payload = {
		  user,
		  accessToken,
		};
		return user;
	  }
}

