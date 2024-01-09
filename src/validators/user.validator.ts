import { body } from 'express-validator'
import { inputValidation } from '../middlewares/input.validation'
import { blogsRepository } from '../repositories/blogs.repository'

export const loginValidation = body('login')
	.isString()
	.withMessage('Login must be a string')
	.trim()
	.isLength({ min: 1 })
	.withMessage('Incorrect login')

export const passwordValidation = body('password')
	.isString()
	.withMessage('Password must be a string')
	.trim()
	.isLength({ min: 1 })
	.withMessage('Incorrect password')

export const emailValidation = body('email')
	.isString()
	.withMessage('Email must be a string')
	.trim()
	.isLength({ min: 1 })
	.matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
	.withMessage('Incorrect email')

export function userValidation() {
	return [loginValidation, passwordValidation, emailValidation, inputValidation]
}
