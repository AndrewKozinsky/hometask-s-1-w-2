import { Request, Response, NextFunction } from 'express'
import { jwtService } from '../application/jwt.service'
import { HTTP_STATUSES } from '../config/config'
import { usersService } from '../services/users.service'

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
	const authorizationHeader = req.headers['authorization']

	if (!authorizationHeader) {
		res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
		return
	}

	const token = authorizationHeader.split(' ')[1]

	const userId = jwtService.getUserIdByToken(token)

	if (userId) {
		req.user = await usersService.getUser(userId)
		next()
		return
	}

	res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
}
