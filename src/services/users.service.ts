import { hashService } from '../adapters/hash.adapter'
import { DBTypes } from '../models/db'
import { CreateUserDtoModel } from '../models/input/users.input.model'
import { usersRepository } from '../repositories/users.repository'

export const usersService = {
	async getUser(userId: string) {
		return usersRepository.getUserById(userId)
	},
	async createUser(dto: CreateUserDtoModel) {
		const passwordSalt = await hashService.generateSalt()
		const passwordHash = await hashService.generateHash(dto.password, passwordSalt)

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
}
