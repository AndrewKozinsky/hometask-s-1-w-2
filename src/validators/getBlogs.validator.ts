import { param } from 'express-validator'
import { inputValidation } from '../middlewares/input.validation'

export const searchNameTermValidation = param('searchNameTerm')
	.optional()
	.isString()
	.withMessage('SearchNameTerm must be a string')

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

export function getBlogsValidation() {
	return [
		searchNameTermValidation,
		sortByValidation,
		sortDirectionValidation,
		pageNumberValidation,
		pageSizeValidation,
		inputValidation,
	]
}
