import express, { Request, Response } from 'express'
import { HTTP_STATUSES } from '../config/config'
import DbNames from '../config/dbNames'
import RouteNames from '../config/routeNames'
import { authMiddleware } from '../middlewares/auth.middleware'
import { DBTypes } from '../models/db'
import { CreatePostDtoModel, UpdatePostDtoModel } from '../models/posts.model'
import { ReqWithBody, ReqWithParams, ReqWithParamsAndBody } from '../models/common'
import { client } from '../repositories/db'
import { postsRepository } from '../repositories/posts.repository'
import { postValidation } from '../validators/post.validator'

function getTestRouter() {
	const router = express.Router()

	router.delete('/all-data', async (req: ReqWithParams<{ id: string }>, res: Response) => {
		await Promise.all([
			client
				.db(process.env.MONGO_DB_NAME)
				.collection<DBTypes.Blog>(DbNames.blogs)
				.deleteMany({}),
			client
				.db(process.env.MONGO_DB_NAME)
				.collection<DBTypes.Blog>(DbNames.posts)
				.deleteMany({}),
		])

		res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
	})

	return router
}

export default getTestRouter
