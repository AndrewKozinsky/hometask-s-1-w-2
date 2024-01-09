import express, { Response } from 'express'
import { HTTP_STATUSES } from '../config/config'
import { CreateUserDtoModel, GetUsersQueries } from '../models/input/users.input.model'
import { authMiddleware } from '../middlewares/auth.middleware'
import { ReqWithBody, ReqWithParams, ReqWithParamsAndBody, ReqWithQuery } from '../models/common'
import { usersQueryRepository } from '../repositories/users.queryRepository'
import { usersService } from '../services/users.service'
import { getUsersValidation } from '../validators/getUsers.validator'
import { userValidation } from '../validators/user.validator'

function getUsersRouter() {
	const router = express.Router()

	// Returns all users
	router.get(
		'/',
		authMiddleware,
		getUsersValidation(),
		async (req: ReqWithQuery<GetUsersQueries>, res: Response) => {
			const users = await usersQueryRepository.getUsers(req.query)
			res.status(HTTP_STATUSES.OK_200).send(users)
		},
	)

	// Create new user
	router.post(
		'/',
		authMiddleware,
		userValidation(),
		async (req: ReqWithBody<CreateUserDtoModel>, res: Response) => {
			const createdUserId = await usersService.createUser(req.body)

			const getPostRes = await usersQueryRepository.getUser(
				createdUserId.insertedId.toString(),
			)

			res.status(HTTP_STATUSES.CREATED_201).send(getPostRes)
		},
	)

	// Delete user specified by id
	router.delete(
		'/:id',
		authMiddleware,
		async (req: ReqWithParams<{ id: string }>, res: Response) => {
			const userId = req.params.id

			const isUserDeleted = await usersService.deleteUser(userId)

			if (!isUserDeleted) {
				res.sendStatus(HTTP_STATUSES.NOT_FOUNT_404)
				return
			}

			res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
		},
	)

	return router
}

export default getUsersRouter
