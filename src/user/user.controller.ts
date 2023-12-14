import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { UserAuthDto, UserChangePasswordDto, UserRegistrationDto } from './user.dto'
import { JwtService } from '@nestjs/jwt'
import { UserGuard } from './user.guard'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Пользователь')
@Controller('user')
export class UserController {
	constructor(
		private userService: UserService,
		private jwtService: JwtService
	) {}

	@ApiOperation({ summary: 'Получение пользователя' })
	@ApiResponse({ status: HttpStatus.OK })
	@ApiBearerAuth()
	@UseGuards(UserGuard)
	@HttpCode(HttpStatus.OK)
	@Get(':userId')
	async getOneUser(@Param('userId') userId: number) {
		try {
			const user = await this.userService.findIdUser(userId)

			if (user) {
				return {
					message: 'Пользователь успешно получен',
					type: 'success',
					data: {
						userId: user.userId,
						name: user.name,
						email: user.email
					}
				}
			}

			return {
				message: 'Пользователь не найден',
				type: 'warning',
				data: {}
			}
		} catch (e) {
			throw new HttpException({ message: 'Ошибка в сервере', type: 'error', data: false }, HttpStatus.INTERNAL_SERVER_ERROR)
		}
	}

	@ApiOperation({ summary: 'Регистрация' })
	@ApiResponse({ status: HttpStatus.CREATED })
	@HttpCode(HttpStatus.CREATED)
	@Post('registration')
	async registration(@Body() body: UserRegistrationDto) {
		try {
			const { name, password, email } = body

			const candidate = await this.userService.findOneUser(email)

			if (candidate) {
				return {
					message: `Пользователь с такой эл.почтой ${email} уже зарегистирован`,
					type: 'warning',
					data: false
				}
			}

			const result = await this.userService.createUser(email, name, password)

			if (result.raw.length) {
				return {
					message: 'Регистрация прошла успешно',
					type: 'success',
					data: true
				}
			}

			return {
				message: 'Регистрация не удалось',
				type: 'warning',
				data: false
			}
		} catch (e) {
			throw new HttpException({ message: 'Ошибка в сервере', type: 'error', data: false }, HttpStatus.INTERNAL_SERVER_ERROR)
		}
	}

	@ApiOperation({ summary: 'Авторизация' })
	@ApiResponse({ status: HttpStatus.ACCEPTED })
	@HttpCode(HttpStatus.ACCEPTED)
	@Post('auth')
	async authentication(@Body() body: UserAuthDto) {
		try {
			const user = await this.userService.findOneUser(body.email)

			if (!user) {
				return {
					message: 'Неправильный логин или пароль',
					type: 'warning',
					data: {}
				}
			}

			const isPassword = await this.userService.checkPassword(body.password, user.password)

			if (!isPassword) {
				return {
					message: 'Неправильный логин или пароль',
					type: 'warning',
					data: {}
				}
			}

			const token = this.jwtService.sign({ name: user.name, userId: user.userId, email: user.email })

			return {
				message: 'Авторизация прошла успешно',
				type: 'success',
				data: {
					name: user.name,
					userId: user.userId,
					email: user.email,
					token: `Bearer ${token}`
				}
			}
		} catch (e) {
			throw new HttpException({ message: 'Ошибка в сервере', type: 'error', data: false }, HttpStatus.INTERNAL_SERVER_ERROR)
		}
	}

	@ApiOperation({ summary: 'Измение пароля пользователя' })
	@ApiResponse({ status: HttpStatus.OK })
	@ApiBearerAuth()
	@UseGuards(UserGuard)
	@HttpCode(HttpStatus.OK)
	@Put('change-password')
	async changePassword(@Body() body: UserChangePasswordDto) {
		try {
			const { userId, newPassword } = body
			await this.userService.updatePassword(userId, newPassword)

			return {
				message: 'Пароль успешно изменен',
				type: 'success',
				data: []
			}
		} catch (e) {
			throw new HttpException({ message: 'Ошибка в сервере', type: 'error', data: false }, HttpStatus.INTERNAL_SERVER_ERROR)
		}
	}

	@ApiOperation({ summary: 'Удаление пользователя' })
	@ApiResponse({ status: HttpStatus.OK })
	@ApiBearerAuth()
	@UseGuards(UserGuard)
	@HttpCode(HttpStatus.OK)
	@Delete('delete/:userId')
	async deleteUser(@Param('userId') userId: number) {
		try {
			await this.userService.deleteUser(userId)

			return {
				message: 'Пользователь успешно удален',
				type: 'success',
				data: []
			}
		} catch (e) {
			throw new HttpException({ message: 'Ошибка в сервере', type: 'error', data: false }, HttpStatus.INTERNAL_SERVER_ERROR)
		}
	}
}
