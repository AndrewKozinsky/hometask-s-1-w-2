import { body, query } from 'express-validator'
import { inputValidation } from '../middlewares/input.validation'

export const codeValidation = body('code').isString().withMessage('Code must be a string')

export function authRegistrationConfirmationValidation() {
	return [codeValidation, inputValidation]
}
