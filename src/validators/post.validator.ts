import { body } from 'express-validator'
import { inputValidation } from '../middlewares/input.validation'
import { DBTypes } from '../models/db'
import { blogsRepository } from '../repositories/blogs.repository'

export const titleValidation = body('title')
	.isString()
	.trim()
	.isLength({ min: 1, max: 30 })
	.withMessage('Incorrect title')

export const shortDescriptionValidation = body('shortDescription')
	.isString()
	.trim()
	.isLength({ min: 1, max: 100 })
	.withMessage('Incorrect shortDescription')

export const contentValidation = body('content')
	.isString()
	.trim()
	.isLength({ min: 1, max: 1000 })
	.withMessage('Incorrect content')

function getBlogIdValidation(db: DBTypes.DB) {
	return body('description')
		.isString()
		.trim()
		.isLength({ min: 1, max: 100 })
		.custom((value) => {
			const blog = blogsRepository.getBlog(db, value)

			if (!blog) {
				throw new Error('Incorrect blogId')
			}

			return true
		})
		.withMessage('Incorrect blogId')
}

export function postValidation(db: DBTypes.DB) {
	return [
		titleValidation,
		shortDescriptionValidation,
		contentValidation,
		getBlogIdValidation(db),
		inputValidation,
	]
}
