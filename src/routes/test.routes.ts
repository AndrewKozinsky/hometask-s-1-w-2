import express, { Request, Response } from 'express'
import { HTTP_STATUSES } from '../config/config'
import RoutesNames from '../config/routesNames'
import { authMiddleware } from '../middlewares/auth.middleware'
import { DBTypes } from '../models/db'
import { CreatePostDtoModel, UpdatePostDtoModel } from '../models/posts.model'
import { ReqWithBody, ReqWithParams, ReqWithParamsAndBody } from '../models/common'
import { postsRepository } from '../repositories/posts.repository'
import { postValidation } from '../validators/post.validator'

function getTestRouter(db: DBTypes.DB) {
	const router = express.Router()

	router.delete(
		RoutesNames.testing.allData,
		authMiddleware,
		(req: ReqWithParams<{ id: string }>, res: Response) => {
			db.blogs.length = 0
			db.posts.length = 0

			res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
		},
	)

	return router
}

export default getTestRouter
