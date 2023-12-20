import express, { Request, Response } from 'express'
import { HTTP_STATUSES } from '../config/config'
import { authMiddleware } from '../middlewares/auth.middleware'
import { CreateBlogDtoModel, UpdateBlogDtoModel } from '../models/blogs.model'
import { DBTypes } from '../models/db'
import { blogsRepository } from '../repositories/blogs.repository'
import { ReqWithBody, ReqWithParams, ReqWithParamsAndBody } from '../models/common'
import { blogValidation } from '../validators/blog.validator'

function getBlogsRouter(db: DBTypes.DB) {
	const router = express.Router()

	router.get('/', (req: Request, res: Response) => {
		const blogs = blogsRepository.getBlogs(db)

		res.status(HTTP_STATUSES.OK_200).send(blogs)
	})

	router.post(
		'/',
		authMiddleware,
		blogValidation(),
		(req: ReqWithBody<CreateBlogDtoModel>, res: Response) => {
			const createdBlog = blogsRepository.createBlog(db, req.body)

			res.status(HTTP_STATUSES.CREATED_201).send(createdBlog)
		},
	)

	router.get('/:id', (req: ReqWithParams<{ id: string }>, res: Response) => {
		const blogId = req.params.id
		const blog = blogsRepository.getBlog(db, blogId)

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
		(req: ReqWithParamsAndBody<{ id: string }, UpdateBlogDtoModel>, res: Response) => {
			const blogId = req.params.id
			const updatedBlog = blogsRepository.updateBlog(db, blogId, req.body)

			if (!updatedBlog) {
				res.sendStatus(HTTP_STATUSES.NOT_FOUNT_404)
				return
			}

			res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
		},
	)

	router.delete('/:id', authMiddleware, (req: ReqWithParams<{ id: string }>, res: Response) => {
		const blogId = req.params.id
		const isBlogDeleted = blogsRepository.deleteBlog(db, blogId)

		if (!isBlogDeleted) {
			res.sendStatus(HTTP_STATUSES.NOT_FOUNT_404)
		}

		res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
	})

	return router
}

export default getBlogsRouter
