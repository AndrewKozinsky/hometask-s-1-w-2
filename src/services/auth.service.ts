import { emailManager } from '../managers/email.manager'
import { AuthLoginDtoModel } from '../models/input/authLogin.input.model'
import { AuthRegistrationDtoModel } from '../models/input/authRegistration.input.model'
import { AuthRegistrationConfirmationDtoModel } from '../models/input/authRegistrationConfirmation.input.model'
import { MeOutModel } from '../models/output/auth.output.model'
import { UserServiceModel } from '../models/service/users.service.model'
import { usersRepository } from '../repositories/users.repository'
import { usersService } from './users.service'

export const authService = {
	async getUserByLoginOrEmailAndPassword(dto: AuthLoginDtoModel) {
		return usersRepository.getUserByLoginAndPassword(dto)
	},

	async registration(dto: AuthRegistrationDtoModel) {
		const userId = await usersService.createUser(dto)

		const user = await usersService.getUser(userId)
		if (!user) {
			return {
				status: 'userNotCreated',
			}
		}

		try {
			await emailManager.sendEmailConfirmationMessage(user.email)
			return {
				status: 'success',
			}
		} catch (err: unknown) {
			console.log(err)
			await usersService.deleteUser(userId)

			return {
				status: 'userNotDeletedAfterConfirmEmailNotSend',
			}
		}
	},

	async confirmEmail(user: UserServiceModel, dto: AuthRegistrationConfirmationDtoModel) {
		const foundedUser = await usersService.getUser(user.id)
		if (!foundedUser) {
			return {
				status: 'userNotFound',
			}
		}

		// if (foundedUser.)
	},

	getCurrentUser(user: UserServiceModel): MeOutModel {
		return {
			userId: user.id,
			email: user.email,
			login: user.login,
		}
	},
}
