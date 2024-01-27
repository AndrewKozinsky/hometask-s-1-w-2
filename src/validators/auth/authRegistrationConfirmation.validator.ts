import { body, query } from 'express-validator'
import { inputValidation } from '../../middlewares/input.validation'
import { authRepository } from '../../repositories/auth.repository'

export const codeValidation = body('code')
	.isString()
	.isLength({ min: 1, max: 100 })
	.withMessage('Code must be a string')
	.custom(async (value) => {
		const user = await authRepository.getUserByLoginOrEmail(value)

		if (user?.emailConfirmation.isConfirmed) {
			throw new Error('Email exists already')
		}

		return true
	})
	.withMessage('Email is already confirmed')

export function authRegistrationConfirmationValidation() {
	return [codeValidation, inputValidation]
}
