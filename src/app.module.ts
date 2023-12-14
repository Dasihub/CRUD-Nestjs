import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './user/user.module'
import { UserEntity } from './user/user.entity'

@Module({
	providers: [],
	controllers: [],
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRoot({
			type: 'postgres',
			database: process.env.POSTGRES_DB,
			port: Number(process.env.POSTGRES_PORT),
			host: process.env.POSTGRES_HOST,
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			synchronize: true,
			entities: [UserEntity]
		}),
		UserModule
	]
})
export class AppModule {}
