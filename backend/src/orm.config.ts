import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const config: TypeOrmModuleOptions = {
	type:'postgres',
	port: 6543,
	host: '127.0.0.1',
	username: 'postgres',
	password: 'postgres',
	database: 'pongDB',
	entities: ["dist/*/.entity{.ts,.js}"],
	synchronize: true,
}
