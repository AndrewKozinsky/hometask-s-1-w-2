import { uuid } from 'uuidv4'
import { hashService } from '../adapters/hash.adapter'
import { DBTypes } from '../models/db'
import { CreateUserDtoModel } from '../models/input/users.input.model'
import { usersRepository } from '../repositories/users.repository'
import { add } from 'date-fns'

export const usersService = {
	async getUser(userId: string) {
		return usersRepository.getUserById(userId)
	},
	async createUser(dto: CreateUserDtoModel) {
		const passwordSalt = await hashService.generateSalt()
		const passwordHash = await hashService.generateHash(dto.password, passwordSalt)

		const newUserDto: DBTypes.User = {
			account: {
				login: dto.login,
				email: dto.email,
				password: passwordHash,
				createdAt: new Date().toISOString(),
			},
			emailConfirmation: {
				confirmationCode: uuid(),
				expirationDate: add(new Date(), { hours: 1, minutes: 3 }),
				isConfirmed: false,
			},
		}

		return usersRepository.createUser(newUserDto)
	},

	async deleteUser(userId: string): Promise<boolean> {
		return usersRepository.deleteUser(userId)
	},
}
