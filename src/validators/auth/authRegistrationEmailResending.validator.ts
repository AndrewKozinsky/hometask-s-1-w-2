import { body } from 'express-validator'
import { inputValidation } from '../../middlewares/input.validation'
import { authRepository } from '../../repositories/auth.repository'
export const emailValidation = body('email')
	.isString()
	.withMessage('Email must be a string')
	.matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
	.withMessage('Incorrect email')
	.custom(async (value) => {
		const user = await authRepository.getUserByEmail(value)

		if (user?.emailConfirmation.isConfirmed) {
			throw new Error('Email exists already')
		}

		return true
	})
	.withMessage('Email is already confirmed')

export function authRegistrationEmailResending() {
	return [emailValidation, inputValidation]
}
