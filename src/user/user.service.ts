import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { UserEntity } from './user.entity'
import { DeleteResult, InsertResult, Repository } from 'typeorm'

@Injectable()
export class UserService {
	constructor(@InjectRepository(UserEntity) private userEntity: Repository<UserEntity>) {}

	async findIdUser(userId: number): Promise<UserEntity> {
		try {
			return this.userEntity.findOne({ where: { userId } })
		} catch (e) {
			console.log(e)
		}
	}

	async findOneUser(email: string): Promise<UserEntity | null> {
		try {
			return await this.userEntity.findOne({ where: { email } })
		} catch (e) {
			console.log(e)
		}
	}

	async createUser(email: string, name: string, password: string): Promise<InsertResult> {
		try {
			const hashPassword = await bcrypt.hash(password, 7)
			return await this.userEntity.insert({ email, name, password: hashPassword })
		} catch (e) {
			console.log(e)
		}
	}

	async checkPassword(password: string, hashPassword): Promise<boolean> {
		try {
			return await bcrypt.compare(password, hashPassword)
		} catch (e) {
			console.log(e)
		}
	}

	async updatePassword(userId: number, newPassword: string) {
		try {
			const user = await this.userEntity.findOne({ where: { userId } })
			const hashPassword = await bcrypt.hash(newPassword, 7)
			user.password = hashPassword
			await this.userEntity.save(user)
		} catch (e) {
			console.log(e)
		}
	}

	async deleteUser(userId: number): Promise<DeleteResult> {
		try {
			return this.userEntity.delete({ userId })
		} catch (e) {
			console.log(e)
		}
	}
}
