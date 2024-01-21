import express, { Request, Response } from 'express'
import { HTTP_STATUSES } from '../config/config'
import { userAuthMiddleware } from '../middlewares/userAuth.middleware'
import { LoginDtoModel } from '../models/input/auth.input.model'
import { ReqWithBody } from '../models/common'
import { authService } from '../services/auth.service'
import { jwtService } from '../application/jwt.service'
import { authLoginValidation } from '../validators/authLogin.validator'

function getAuthRouter() {
	const router = express.Router()

	// User login
	router.post(
		'/login',
		authLoginValidation(),
		async (req: ReqWithBody<LoginDtoModel>, res: Response) => {
			const user = await authService.getUserByLoginOrEmailAndPassword(req.body)

			if (!user) {
				res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
				return
			}

			res.status(HTTP_STATUSES.OK_200).send({
				accessToken: jwtService.createJWT(user),
			})
		},
	)

	// Get information about current user
	router.get('/me', userAuthMiddleware, async (req: Request, res: Response) => {
		const user = authService.getCurrentUser(req.user!)
		res.status(HTTP_STATUSES.OK_200).send(user)
	})

	return router
}

export default getAuthRouter
