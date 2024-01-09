import { body, query } from 'express-validator'
import { inputValidation } from '../middlewares/input.validation'

export const sortByValidation = body('loginOrEmail')
	.isString()
	.withMessage('LoginOrEmail must be a string')

export const passwordValidation = body('password')
	.isString()
	.withMessage('Password must be a string')

export function authLoginValidation() {
	return [sortByValidation, passwordValidation, inputValidation]
}
