import { LoginDtoModel } from '../models/input/auth.input.model'
import { usersRepository } from '../repositories/users.repository'

export const authService = {
	async getUserByLoginOrEmailAndPassword(dto: LoginDtoModel) {
		return usersRepository.getUserByLoginAndPassword(dto)
	},
}
