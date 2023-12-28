import express, { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { HTTP_STATUSES } from '../config/config'
import { blogsService } from '../domain/blogs.service'
import { authMiddleware } from '../middlewares/auth.middleware'
import {
	BlogOutModel,
	CreateBlogDtoModel,
	GetBlogsOutModel,
	UpdateBlogDtoModel,
} from '../models/blogs.model'
import { DBTypes } from '../models/db'
import { ReqWithBody, ReqWithParams, ReqWithParamsAndBody } from '../models/common'
import { blogValidation } from '../validators/blog.validator'

function getBlogsRouter() {
	const router = express.Router()

	router.get('/', async function (req: Request, res: Response) {
		const blogs = await blogsService.getBlogs()

		res.status(HTTP_STATUSES.OK_200).send(blogs)
	})

	router.post(
		'/',
		authMiddleware,
		blogValidation(),
		async function (req: ReqWithBody<CreateBlogDtoModel>, res: Response) {
			const createdBlog = await blogsService.createBlog(req.body)

			res.status(HTTP_STATUSES.CREATED_201).send(createdBlog)
		},
	)

	router.get('/:id', async (req: ReqWithParams<{ id: string }>, res: Response) => {
		const blogId = req.params.id

		const blog = await blogsService.getBlog(blogId)

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
			const updatedBlog = await blogsService.updateBlog(blogId, req.body)

			if (!updatedBlog) {
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
