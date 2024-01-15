import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { UserServiceModel } from '../models/service/users.service.model'
import { settings } from '../settings'

export const jwtService = {
	createJWT(user: UserServiceModel) {
		const token = jwt.sign({ userId: user.id }, settings.JWT_SECRET, { expiresIn: '1m' })

		return token
	},

	async getUserIdByToken(token: string) {
		try {
			const result: any = jwt.verify(token, settings.JWT_SECRET)
			return result.userId
		} catch (error) {
			return null
		}
	},
}
