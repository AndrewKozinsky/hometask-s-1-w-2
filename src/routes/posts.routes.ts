import express, { Request, Response } from 'express'
import { HTTP_STATUSES } from '../config/config'
import { authMiddleware } from '../middlewares/auth.middleware'
import { DBTypes } from '../models/db'
import { CreatePostDtoModel, UpdatePostDtoModel } from '../models/posts.model'
import { ReqWithBody, ReqWithParams, ReqWithParamsAndBody } from '../models/common'
import { postsRepository } from '../repositories/posts.repository'
import { postValidation } from '../validators/post.validator'

function getPostsRouter(db: DBTypes.DB) {
	const router = express.Router()

	router.get('/', (req: Request, res: Response) => {
		const posts = postsRepository.getPosts(db)

		res.status(HTTP_STATUSES.OK_200).send(posts)
	})

	router.post(
		'/',
		authMiddleware,
		postValidation(db),
		(req: ReqWithBody<CreatePostDtoModel>, res: Response) => {
			const createdPost = postsRepository.createPost(db, req.body)

			res.status(HTTP_STATUSES.CREATED_201).send(createdPost)
		},
	)

	router.get('/:id', (req: ReqWithParams<{ id: string }>, res: Response) => {
		const postId = req.params.id
		const post = postsRepository.getPost(db, postId)

		if (!post) {
			res.sendStatus(HTTP_STATUSES.NOT_FOUNT_404)
		}

		res.status(HTTP_STATUSES.OK_200).send(post)
	})

	router.put(
		'/:id',
		authMiddleware,
		postValidation(db),
		(req: ReqWithParamsAndBody<{ id: string }, UpdatePostDtoModel>, res: Response) => {
			const postId = req.params.id
			const updatedPost = postsRepository.updatePost(db, postId, req.body)

			if (!updatedPost) {
				res.sendStatus(HTTP_STATUSES.NOT_FOUNT_404)
			}

			res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
		},
	)

	router.delete('/:id', authMiddleware, (req: ReqWithParams<{ id: string }>, res: Response) => {
		const postId = req.params.id
		const isPostDeleted = postsRepository.deletePost(db, postId)

		if (!isPostDeleted) {
			res.sendStatus(HTTP_STATUSES.NOT_FOUNT_404)
		}

		res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
	})

	return router
}

export default getPostsRouter
