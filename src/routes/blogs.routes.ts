import express, { Response } from 'express'
import { ObjectId } from 'mongodb'
import { HTTP_STATUSES } from '../config/config'
import { postsQueryRepository } from '../repositories/posts.queryRepository'
import { blogsService } from '../services/blogs.service'
import { authMiddleware } from '../middlewares/auth.middleware'
import {
	ReqWithBody,
	ReqWithParams,
	ReqWithParamsAndBody,
	ReqWithParamsAndQueries,
	ReqWithQuery,
} from '../models/common'
import {
	CreateBlogDtoModel,
	CreateBlogPostDtoModel,
	GetBlogPostsQueries,
	GetBlogsQueries,
	UpdateBlogDtoModel,
} from '../models/input/blogs.input.model'
import { blogsQueryRepository } from '../repositories/blogs.queryRepository'
import { blogValidation } from '../validators/blog.validator'
import { createBlogPostsValidation } from '../validators/createBlogPost.validator'
import { getBlogPostsValidation } from '../validators/getBlogPosts.validator'
import { getBlogsValidation } from '../validators/getBlogs.validator'

function getBlogsRouter() {
	const router = express.Router()

	// Returns blogs with paging
	router.get(
		'/',
		getBlogsValidation(),
		async function (req: ReqWithQuery<GetBlogsQueries>, res: Response) {
			const blogs = await blogsQueryRepository.getBlogs(req.params)

			res.status(HTTP_STATUSES.OK_200).send(blogs)
		},
	)

	// Create new blog
	router.post(
		'/',
		authMiddleware,
		blogValidation(),
		async function (req: ReqWithBody<CreateBlogDtoModel>, res: Response) {
			const createdBlogId = await blogsService.createBlog(req.body)
			const createdBlog = await blogsQueryRepository.getBlog(createdBlogId)

			res.status(HTTP_STATUSES.CREATED_201).send(createdBlog)
		},
	)

	// Returns all posts for specified blog
	router.get(
		'/:id/posts',
		getBlogPostsValidation(),
		async (
			req: ReqWithParamsAndQueries<{ id: string }, GetBlogPostsQueries>,
			res: Response,
		) => {
			const blogId = req.params.id

			const posts = await blogsQueryRepository.getBlogPosts(blogId, req.query)

			if (!posts) {
				res.sendStatus(HTTP_STATUSES.NOT_FOUNT_404)
				return
			}

			res.status(HTTP_STATUSES.OK_200).send(posts)
		},
	)

	// Create new post for specific blog
	router.post(
		'/:id/posts',
		authMiddleware,
		createBlogPostsValidation(),
		async function (
			req: ReqWithParamsAndBody<{ id: string }, CreateBlogPostDtoModel>,
			res: Response,
		) {
			const blogId = req.params.id

			if (!ObjectId.isValid(blogId)) {
				res.sendStatus(HTTP_STATUSES.NOT_FOUNT_404)
				return
			}

			const createPostRes = await blogsService.createBlogPost(req.params.id, req.body)
			const createdPost = await postsQueryRepository.getPost(
				createPostRes.insertedId.toString(),
			)

			res.status(HTTP_STATUSES.CREATED_201).send(createdPost)
		},
	)

	// Returns blog by id
	router.get('/:id', async (req: ReqWithParams<{ id: string }>, res: Response) => {
		const blogId = req.params.id

		if (!ObjectId.isValid(blogId)) {
			res.sendStatus(HTTP_STATUSES.NOT_FOUNT_404)
		}

		const blog = await blogsQueryRepository.getBlog(blogId)

		if (!blog) {
			res.sendStatus(HTTP_STATUSES.NOT_FOUNT_404)
			return
		}

		res.status(HTTP_STATUSES.OK_200).send(blog)
	})

	// Update existing Blog by id with InputModel
	router.put(
		'/:id',
		authMiddleware,
		blogValidation(),
		async (req: ReqWithParamsAndBody<{ id: string }, UpdateBlogDtoModel>, res: Response) => {
			const blogId = req.params.id

			if (!ObjectId.isValid(blogId)) {
				res.sendStatus(HTTP_STATUSES.NOT_FOUNT_404)
			}

			const isBlogUpdated = await blogsService.updateBlog(blogId, req.body)

			if (!isBlogUpdated) {
				res.sendStatus(HTTP_STATUSES.NOT_FOUNT_404)
				return
			}

			res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
		},
	)

	// Delete blog specified by id
	router.delete(
		'/:id',
		authMiddleware,
		async (req: ReqWithParams<{ id: string }>, res: Response) => {
			const blogId = req.params.id

			if (!ObjectId.isValid(blogId)) {
				res.sendStatus(HTTP_STATUSES.NOT_FOUNT_404)
			}

			const isBlogDeleted = await blogsService.deleteBlog(blogId)

			if (!isBlogDeleted) {
				res.sendStatus(HTTP_STATUSES.NOT_FOUNT_404)
				return
			}

			res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
		},
	)

	return router
}

export default getBlogsRouter
