import express, { Response } from 'express'
import { HTTP_STATUSES } from '../config/config'
import { adminAuthMiddleware } from '../middlewares/adminAuth.middleware'
import { commentsQueryRepository } from '../repositories/comments.queryRepository'
import { postsService } from '../services/posts.service'
import { userAuthMiddleware } from '../middlewares/userAuth.middleware'
import { ReqWithBody, ReqWithParams, ReqWithParamsAndBody, ReqWithQuery } from '../models/common'
import {
	CreatePostDtoModel,
	GetPostsQueries,
	UpdatePostDtoModel,
} from '../models/input/posts.input.model'
import { postsQueryRepository } from '../repositories/posts.queryRepository'
import { getPostsValidation } from '../validators/getPosts.validator'
import { postValidation } from '../validators/post.validator'

function getPostsRouter() {
	const router = express.Router()

	// Returns all posts
	router.get(
		'/',
		getPostsValidation(),
		async (req: ReqWithQuery<GetPostsQueries>, res: Response) => {
			const posts = await postsQueryRepository.getPosts(req.query)

			res.status(HTTP_STATUSES.OK_200).send(posts)
		},
	)

	// Create new post
	router.post(
		'/',
		adminAuthMiddleware,
		postValidation(),
		async (req: ReqWithBody<CreatePostDtoModel>, res: Response) => {
			const createPostId = await postsService.createPost(req.body)

			const getPostRes = await postsQueryRepository.getPost(createPostId)

			res.status(HTTP_STATUSES.CREATED_201).send(getPostRes)
		},
	)

	// Return post by id
	router.get('/:postId', async (req: ReqWithParams<{ postId: string }>, res: Response) => {
		const postId = req.params.postId

		const post = await postsQueryRepository.getPost(postId)

		if (!post) {
			res.sendStatus(HTTP_STATUSES.NOT_FOUNT_404)
			return
		}

		res.status(HTTP_STATUSES.OK_200).send(post)
	})

	// Update existing post by id with InputModel
	router.put(
		'/:postId',
		adminAuthMiddleware,
		postValidation(),
		async (
			req: ReqWithParamsAndBody<{ postId: string }, UpdatePostDtoModel>,
			res: Response,
		) => {
			const postId = req.params.postId

			const isPostUpdated = await postsService.updatePost(postId, req.body)

			if (!isPostUpdated) {
				res.sendStatus(HTTP_STATUSES.NOT_FOUNT_404)
				return
			}

			res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
		},
	)

	// Delete post specified by id
	router.delete(
		'/:postId',
		adminAuthMiddleware,
		async (req: ReqWithParams<{ postId: string }>, res: Response) => {
			const postId = req.params.postId

			const isPostDeleted = await postsService.deletePost(postId)

			if (!isPostDeleted) {
				res.sendStatus(HTTP_STATUSES.NOT_FOUNT_404)
				return
			}

			res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
		},
	)

	// Returns comments for specified post
	router.get(
		'/:postId/comments',
		async (req: ReqWithParams<{ postId: string }>, res: Response) => {
			const postId = req.params.postId
			const post = await commentsQueryRepository.getPostComments(postId)
			if (!post) {
				res.sendStatus(HTTP_STATUSES.NOT_FOUNT_404)
				return
			}
			res.status(HTTP_STATUSES.OK_200).send(post)
		},
	)

	// Create new comment
	router.post(
		'/:postId/comments',
		async (req: ReqWithParams<{ postId: string }>, res: Response) => {
			// const postId = req.params.postId
			// const post = await postsQueryRepository.getPost(postId)
			/*if (!post) {
			res.sendStatus(HTTP_STATUSES.NOT_FOUNT_404)
			return
		}*/
			// res.status(HTTP_STATUSES.OK_200).send(post)
		},
	)

	return router
}

export default getPostsRouter
