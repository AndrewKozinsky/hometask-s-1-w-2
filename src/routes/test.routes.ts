import express, { Response } from 'express'
import { HTTP_STATUSES } from '../config/config'
import DbNames from '../config/dbNames'
import { ReqWithParams } from '../models/common'
import { DBTypes } from '../models/db'
import { client } from '../repositories/db'

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
