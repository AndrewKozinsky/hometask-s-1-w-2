import express, { Request, Response } from 'express'
import { HTTP_STATUSES } from '../config/config'
import { authMiddleware } from '../middlewares/auth.middleware'
import { CreatePostDtoModel, UpdatePostDtoModel } from '../models/posts.model'
import { ReqWithBody, ReqWithParams, ReqWithParamsAndBody } from '../models/common'
import { postsRepository } from '../repositories/posts.repository'
import { postValidation } from '../validators/post.validator'

function getPostsRouter() {
	const router = express.Router()

	router.get('/', async (req: Request, res: Response) => {
		const posts = await postsRepository.getPosts()

		res.status(HTTP_STATUSES.OK_200).send(posts)
	})

	router.post(
		'/',
		authMiddleware,
		postValidation(),
		async (req: ReqWithBody<CreatePostDtoModel>, res: Response) => {
			const createdPost = await postsRepository.createPost(req.body)

			res.status(HTTP_STATUSES.CREATED_201).send(createdPost)
		},
	)

	router.get('/:id', async (req: ReqWithParams<{ id: string }>, res: Response) => {
		const postId = req.params.id
		const post = await postsRepository.getPost(postId)

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
			const updatedPost = await postsRepository.updatePost(postId, req.body)

			if (!updatedPost) {
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
			const isPostDeleted = await postsRepository.deletePost(postId)

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
