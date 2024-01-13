import { LoginDtoModel } from '../models/input/auth.input.model'
import { usersRepository } from '../repositories/users.repository'

export const authService = {
	async getUserByLoginAndPassword(dto: LoginDtoModel) {
		return usersRepository.getUserByLoginAndPassword(dto)
	},
}
