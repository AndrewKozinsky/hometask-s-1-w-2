import { emailManager } from '../managers/email.manager'
import { AuthLoginDtoModel } from '../models/input/authLogin.input.model'
import { AuthRegistrationDtoModel } from '../models/input/authRegistration.input.model'
import { AuthRegistrationConfirmationDtoModel } from '../models/input/authRegistrationConfirmation.input.model'
import { AuthRegistrationEmailResendingDtoModel } from '../models/input/authRegistrationEmailResending.input.model'
import { MeOutModel } from '../models/output/auth.output.model'
import { UserServiceModel } from '../models/service/users.service.model'
import { authRepository } from '../repositories/auth.repository'
import { commonService } from './common'
import { usersService } from './users.service'

export const authService = {
	async getUserByLoginOrEmailAndPassword(dto: AuthLoginDtoModel) {
		const user = await authRepository.getUserByLoginAndPassword(dto)

		if (!user || !user.emailConfirmation.isConfirmed) {
			return null
		}

		return user
	},

	async registration(dto: AuthRegistrationDtoModel) {
		const newUserDto = await commonService.getCreateUserDto(dto, false)

		const userId = await authRepository.createUser(newUserDto)

		const user = await usersService.getUser(userId)
		if (!user) {
			return {
				status: 'userNotCreated',
			}
		}

		/*try {
			await emailManager.sendEmailConfirmationMessage(
				user.account.email,
				user.emailConfirmation.confirmationCode,
			)

			return {
				status: 'success',
			}
		} catch (err: unknown) {
			console.log(err)
			await authRepository.deleteUser(userId)

			return {
				status: 'userNotDeletedAfterConfirmEmailNotSend',
			}
		}*/
		//---
		return {
			status: 'success',
		}
	},

	async confirmEmail(dto: AuthRegistrationConfirmationDtoModel) {
		const user = await authRepository.getUserByConfirmationCode(dto.code)
		if (!user || user.emailConfirmation.isConfirmed) {
			return {
				status: 'fail',
			}
		}

		if (
			user.emailConfirmation.confirmationCode !== dto.code ||
			user.emailConfirmation.expirationDate < new Date()
		) {
			return {
				status: 'fail',
			}
		}

		await authRepository.makeUserEmailConfirmed(user.id)

		return {
			status: 'success',
		}
	},

	async resendEmailConfirmationCode(dto: AuthRegistrationEmailResendingDtoModel) {
		const { email } = dto

		const user = await authRepository.getUserByEmail(email)

		if (!user || user.emailConfirmation.isConfirmed) {
			return {
				status: 'userNotFoundOrEmailConfirmed',
			}
		}

		try {
			await emailManager.sendEmailConfirmationMessage(
				email,
				user.emailConfirmation.confirmationCode,
			)
			return {
				status: 'success',
			}
		} catch (err: unknown) {
			console.log(err)

			return {
				status: 'confirmEmailNotSend',
			}
		}
	},

	getCurrentUser(user: UserServiceModel): MeOutModel {
		return {
			userId: user.id,
			email: user.account.email,
			login: user.account.login,
		}
	},
}
