import express, { Request, Response } from 'express'
import { HTTP_STATUSES } from '../config/config'
import { blogsService } from '../domain/blogs.service'
import { authMiddleware } from '../middlewares/auth.middleware'
import { CreateBlogDtoModel, UpdateBlogDtoModel } from '../models/blogs.model'
import { ReqWithBody, ReqWithParams, ReqWithParamsAndBody } from '../models/common'
import { blogsQueryRepository } from '../repositories/blogs.queryRepository'
import { blogValidation } from '../validators/blog.validator'

function getBlogsRouter() {
	const router = express.Router()

	router.get('/', async function (req: Request, res: Response) {
		const blogs = await blogsQueryRepository.getBlogs()

		res.status(HTTP_STATUSES.OK_200).send(blogs)
	})

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

	router.get('/:id', async (req: ReqWithParams<{ id: string }>, res: Response) => {
		const blogId = req.params.id

		const blog = await blogsQueryRepository.getBlog(blogId)

		if (!blog) {
			res.sendStatus(HTTP_STATUSES.NOT_FOUNT_404)
			return
		}

		res.status(HTTP_STATUSES.OK_200).send(blog)
	})

	router.put(
		'/:id',
		authMiddleware,
		blogValidation(),
		async (req: ReqWithParamsAndBody<{ id: string }, UpdateBlogDtoModel>, res: Response) => {
			const blogId = req.params.id
			const isBlogUpdated = await blogsService.updateBlog(blogId, req.body)

			if (!isBlogUpdated) {
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
			const blogId = req.params.id
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
