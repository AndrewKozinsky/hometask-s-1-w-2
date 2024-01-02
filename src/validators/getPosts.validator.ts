import { param } from 'express-validator'
import { inputValidation } from '../middlewares/input.validation'

export const sortByValidation = param('sortBy')
	.optional()
	.isString()
	.withMessage('SortBy must be a string')

export const sortDirectionValidation = param('sortDirection')
	.optional()
	.isIn(['desc', 'asc'])
	.withMessage('SortBy must has desc value or asc')

export const pageNumberValidation = param('pageNumber')
	.optional()
	.isInt()
	.withMessage('PageNumber must be a number')

export const pageSizeValidation = param('pageSize')
	.optional()
	.isInt()
	.withMessage('PageSize must be a number')

export function getPostsValidation() {
	return [
		sortByValidation,
		sortDirectionValidation,
		pageNumberValidation,
		pageSizeValidation,
		inputValidation,
	]
}
