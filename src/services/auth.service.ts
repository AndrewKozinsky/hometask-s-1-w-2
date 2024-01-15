import { Request } from 'express'
import { jwtService } from '../application/jwt.service'
import { LoginDtoModel } from '../models/input/auth.input.model'
import { MeOutModel } from '../models/output/auth.output.model'
import { usersRepository } from '../repositories/users.repository'

export const authService = {
	async getUserByLoginOrEmailAndPassword(dto: LoginDtoModel) {
		return usersRepository.getUserByLoginAndPassword(dto)
	},

	async getCurrentUser(req: Request): Promise<null | MeOutModel> {
		const authorizationHeader = req.headers.authorization
		if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
			return null
		}

		const token = authorizationHeader.split(' ')[1]

		const userId = await jwtService.getUserIdByToken(token)
		if (!userId) return null

		const user = await usersRepository.getUserById(userId)
		if (!user) return null

		return {
			userId: user.id,
			email: user.email,
			login: user.login,
		}
	},
}
