import express, { Request, Response } from 'express'
import { HTTP_STATUSES } from '../config/config'
import { postsService } from '../services/posts.service'
import { authMiddleware } from '../middlewares/auth.middleware'
import { ReqWithBody, ReqWithParams, ReqWithParamsAndBody } from '../models/common'
import { CreatePostDtoModel, UpdatePostDtoModel } from '../models/input/posts.input.model'
import { postsQueryRepository } from '../repositories/posts.queryRepository'
import { postsRepository } from '../repositories/posts.repository'
import { postValidation } from '../validators/post.validator'

function getPostsRouter() {
	const router = express.Router()

	router.get('/', async (req: Request, res: Response) => {
		const posts = await postsQueryRepository.getPosts()

		res.status(HTTP_STATUSES.OK_200).send(posts)
	})

	router.post(
		'/',
		authMiddleware,
		postValidation(),
		async (req: ReqWithBody<CreatePostDtoModel>, res: Response) => {
			const createPostId = await postsService.createPost(req.body)

			const getPostRes = await postsRepository.getPostById(createPostId.insertedId.toString())

			res.status(HTTP_STATUSES.CREATED_201).send(getPostRes)
		},
	)

	router.get('/:id', async (req: ReqWithParams<{ id: string }>, res: Response) => {
		const postId = req.params.id
		const post = await postsQueryRepository.getPost(postId)

		if (!post) {
			res.sendStatus(HTTP_STATUSES.NOT_FOUNT_404)
			return
		}

		res.status(HTTP_STATUSES.OK_200).send(post)
	})

	router.put(
		'/:id',
		authMiddleware,
		postValidation(),
		async (req: ReqWithParamsAndBody<{ id: string }, UpdatePostDtoModel>, res: Response) => {
			const postId = req.params.id
			const isPostUpdated = await postsService.updatePost(postId, req.body)

			if (!isPostUpdated) {
				res.sendStatus(HTTP_STATUSES.NOT_FOUNT_404)
				return
			}

			res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
		},
	)

	router.delete(
		'/:id',
		authMiddleware,
		async (req: ReqWithParams<{ id: string }>, res: Response) => {
			const postId = req.params.id
			const isPostDeleted = await postsService.deletePost(postId)

			if (!isPostDeleted) {
				res.sendStatus(HTTP_STATUSES.NOT_FOUNT_404)
				return
			}

			res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
		},
	)

	return router
}

export default getPostsRouter
