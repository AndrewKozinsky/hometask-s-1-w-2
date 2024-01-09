import { DBTypes } from '../models/db'
import { CreateUserDtoModel } from '../models/input/users.input.model'
import { usersRepository } from '../repositories/users.repository'
import bcrypt from 'bcrypt'

export const usersService = {
	async createUser(dto: CreateUserDtoModel) {
		const passwordSalt = await bcrypt.genSalt()
		const passwordHash = await this._generateHash(dto.password, passwordSalt)

		const newUserDto: DBTypes.User = {
			login: dto.login,
			email: dto.email,
			password: passwordHash,
			createdAt: new Date().toISOString(),
		}

		return usersRepository.createUser(newUserDto)
	},

	async deleteUser(userId: string): Promise<boolean> {
		return usersRepository.deleteUser(userId)
	},

	async _generateHash(str: string, salt: string) {
		return bcrypt.hash(str, salt)
	},
}
