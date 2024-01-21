import { body, param } from 'express-validator'
import { inputValidation } from '../middlewares/input.validation'
import { blogsRepository } from '../repositories/blogs.repository'
import { postsRepository } from '../repositories/posts.repository'

export const contentValidation = body('content')
	.isString()
	.withMessage('Content must be a string')
	.trim()
	.isLength({ min: 20, max: 300 })
	.withMessage('Incorrect content length')

export const blogIdValidation = param('postId')
	.isString()
	.withMessage('PostId must be a string')
	.trim()
	.isLength({ min: 1, max: 100 })
	.custom(async (value) => {
		const post = await postsRepository.getPostById(value)

		if (!post) {
			throw new Error('Incorrect postId')
		}

		return true
	})
	.withMessage('Incorrect postId')

export function createPostCommentValidation() {
	return [contentValidation, blogIdValidation, inputValidation]
}
