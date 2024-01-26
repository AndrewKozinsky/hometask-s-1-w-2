import { add } from 'date-fns'
import { ObjectId, WithId } from 'mongodb'
import { uuid } from 'uuidv4'
import { hashService } from '../adapters/hash.adapter'
import DbNames from '../config/dbNames'
import { db } from '../db/dbService'
import { DBTypes } from '../models/db'
import { UserServiceModel } from '../models/service/users.service.model'

export const commonService = {
	// Return object which can be save in DB to create a new user
	async getCreateUserDto(
		dto: { login: string; email: string; password: string },
		isEmailConfirmed: boolean,
	): Promise<DBTypes.User> {
		const passwordSalt = await hashService.generateSalt()
		const passwordHash = await hashService.generateHash(dto.password, passwordSalt)

		return {
			account: {
				login: dto.login,
				email: dto.email,
				password: passwordHash,
				createdAt: new Date().toISOString(),
			},
			emailConfirmation: {
				confirmationCode: uuid(),
				expirationDate: add(new Date(), { hours: 1, minutes: 3 }),
				isConfirmed: isEmailConfirmed,
			},
		}
	},

	async createUser(dto: DBTypes.User) {
		const userRes = await db.collection(DbNames.users).insertOne(dto)
		return userRes.insertedId.toString()
	},

	async deleteUser(userId: string): Promise<boolean> {
		if (!ObjectId.isValid(userId)) {
			return false
		}

		const result = await db.collection(DbNames.users).deleteOne({ _id: new ObjectId(userId) })

		return result.deletedCount === 1
	},

	mapDbUserToServiceUser(DbUser: WithId<DBTypes.User>): UserServiceModel {
		return {
			id: DbUser._id.toString(),
			account: {
				login: DbUser.account.login,
				email: DbUser.account.email,
				password: DbUser.account.password,
				createdAt: DbUser.account.createdAt,
			},
			emailConfirmation: {
				confirmationCode: DbUser.emailConfirmation.confirmationCode,
				expirationDate: DbUser.emailConfirmation.expirationDate,
				isConfirmed: DbUser.emailConfirmation.isConfirmed,
			},
		}
	},
}
