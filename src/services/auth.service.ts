import { Request } from 'express'
import { jwtService } from '../application/jwt.service'
import { LoginDtoModel } from '../models/input/auth.input.model'
import { MeOutModel } from '../models/output/auth.output.model'
import { UserServiceModel } from '../models/service/users.service.model'
import { usersRepository } from '../repositories/users.repository'

export const authService = {
	async getUserByLoginOrEmailAndPassword(dto: LoginDtoModel) {
		return usersRepository.getUserByLoginAndPassword(dto)
	},

	getCurrentUser(user: UserServiceModel): MeOutModel {
		return {
			userId: user.id,
			email: user.email,
			login: user.login,
		}
	},
}
