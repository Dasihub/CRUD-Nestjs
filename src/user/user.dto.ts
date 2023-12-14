import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNumber, IsString, Length } from 'class-validator'

export class UserAuthDto {
	@ApiProperty({ example: 'dasihub02@gmail.com', description: 'Эл.почта', required: true })
	@IsEmail({}, { message: 'Некорректная эл.почта' })
	readonly email: string

	@ApiProperty({ example: '123456', description: 'Пароль', required: true })
	readonly password: string
}

export class UserRegistrationDto {
	@ApiProperty({ example: 'Дастан', description: 'Имя', required: true })
	@IsString({ message: 'Имя должна быть строкой' })
	readonly name: string

	@ApiProperty({ example: 'dasihub02@gmail.com', description: 'Эл.почта', required: true })
	@IsEmail({}, { message: 'Некорректная эл.почта' })
	readonly email: string

	@ApiProperty({ example: '123456', description: 'Пароль', required: true })
	readonly password: string
}

export class UserChangePasswordDto {
	@ApiProperty({ example: '1', description: 'ID пользователя', required: true })
	@IsNumber({}, { message: 'ID пользователя должны быть число' })
	readonly userId: number

	@ApiProperty({ example: '123456', description: 'Новый пароль', required: true })
	@Length(4, 999, { message: 'Пароль должна быть минимум 5' })
	readonly newPassword: string
}
