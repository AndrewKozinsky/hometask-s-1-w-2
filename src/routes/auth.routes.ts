import express, { Response } from 'express'
import { HTTP_STATUSES } from '../config/config'
import { LoginDtoModel } from '../models/input/auth.input.model'
import { ReqWithBody } from '../models/common'
import { usersRepository } from '../repositories/users.repository'
import { authLoginValidation } from '../validators/authLogin.validator'

function getAuthRouter() {
	const router = express.Router()

	// Returns all users
	router.get(
		'/login',
		authLoginValidation(),
		async (req: ReqWithBody<LoginDtoModel>, res: Response) => {
			const user = await usersRepository.getUserByLoginAndPassword(req.body)

			if (!user) {
				res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
				return
			}

			res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
		},
	)

	return router
}

export default getAuthRouter
