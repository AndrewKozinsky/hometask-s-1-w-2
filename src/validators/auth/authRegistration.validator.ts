import { body, query } from 'express-validator'
import { inputValidation } from '../../middlewares/input.validation'
import { authRepository } from '../../repositories/auth.repository'
import { blogsRepository } from '../../repositories/blogs.repository'
import { usersRepository } from '../../repositories/users.repository'

export const loginValidation = body('login')
	.isString()
	.withMessage('Login must be a string')
	.trim()
	.isLength({ min: 3, max: 10 })
	.matches('^[a-zA-Z0-9_-]*$')
	.withMessage('Incorrect login')

export const passwordValidation = body('password')
	.isString()
	.withMessage('Password must be a string')
	.trim()
	.isLength({ min: 6, max: 20 })
	.withMessage('Incorrect password')

export const emailValidation = body('email')
	.isString()
	.withMessage('Email must be a string')
	.matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
	.withMessage('Incorrect email')
	.custom(async (value) => {
		const user = await authRepository.getUserByEmail(value)

		if (user) {
			throw new Error('Email exists already')
		}

		return true
	})
	.withMessage('Incorrect blogId')

export function authRegistrationValidation() {
	return [loginValidation, passwordValidation, emailValidation, inputValidation]
}
