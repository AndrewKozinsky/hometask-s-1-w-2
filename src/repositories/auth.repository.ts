import { ObjectId, WithId } from 'mongodb'
import { hashService } from '../adapters/hash.adapter'
import DbNames from '../config/dbNames'
import { DBTypes } from '../models/db'
import { AuthLoginDtoModel } from '../models/input/authLogin.input.model'
import { UserServiceModel } from '../models/service/users.service.model'
import { db, dbService } from '../db/dbService'
import { commonService } from '../services/common'

export const authRepository = {
	async getUserByEmail(email: string) {
		const getUserRes = await db
			.collection<DBTypes.User>(DbNames.users)
			.findOne({ 'account.email': email })

		if (!getUserRes) return null

		return this.mapDbUserToServiceUser(getUserRes)
	},

	async getUserByLoginAndPassword(loginDto: AuthLoginDtoModel) {
		const getUserRes = await db
			.collection<DBTypes.User>(DbNames.users)
			.findOne({ $or: [{ login: loginDto.loginOrEmail }, { email: loginDto.loginOrEmail }] })

		if (!getUserRes) {
			return null
		}

		const isPasswordMath = await hashService.compare(
			loginDto.password,
			getUserRes.account.password,
		)

		if (!isPasswordMath) {
			return null
		}

		return this.mapDbUserToServiceUser(getUserRes)
	},

	async getUserByConfirmationCode(confirmationCode: string) {
		const getUserRes = await db
			.collection<DBTypes.User>(DbNames.users)
			.findOne({ 'emailConfirmation.confirmationCode': confirmationCode })

		if (!getUserRes) {
			return null
		}

		return this.mapDbUserToServiceUser(getUserRes)
	},

	async createUser(dto: DBTypes.User) {
		return commonService.createUser(dto)
	},

	async makeUserEmailConfirmed(userId: string) {
		const updateUserRes = await db
			.collection(DbNames.users)
			.updateOne(
				{ _id: new ObjectId(userId) },
				{ $set: { 'emailConfirmation.isConfirmed': true } },
			)

		return updateUserRes.modifiedCount === 1
	},

	async deleteUser(userId: string): Promise<boolean> {
		return commonService.deleteUser(userId)
	},

	mapDbUserToServiceUser(dbUser: WithId<DBTypes.User>): UserServiceModel {
		return commonService.mapDbUserToServiceUser(dbUser)
	},
}
