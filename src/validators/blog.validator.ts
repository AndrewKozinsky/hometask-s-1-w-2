import { body } from 'express-validator'
import { inputValidation } from '../middlewares/input.validation'

export const nameValidation = body('name')
	.isString()
	.trim()
	.isLength({ min: 1, max: 15 })
	.withMessage('Incorrect name')

export const descriptionValidation = body('description')
	.isString()
	.trim()
	.isLength({ min: 1, max: 500 })
	.withMessage('Incorrect description')

export const websiteUrlValidation = body('description')
	.isString()
	.trim()
	.isLength({ min: 1, max: 100 })
	.matches('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$\n')
	.withMessage('Incorrect websiteUrl')

export function blogValidation() {
	return [nameValidation, descriptionValidation, websiteUrlValidation, inputValidation]
}
