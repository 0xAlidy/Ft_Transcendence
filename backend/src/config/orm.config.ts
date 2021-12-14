import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const config: TypeOrmModuleOptions = {
	type:'postgres',
	port: 5432,
	host: 'database',
	username: 'user42',
	password: 'password',
	database: 'database',
	entities: ["dist/**/*.entity{.ts,.js}"],
	synchronize: true,
}
