import { ObjectId, WithId } from 'mongodb'
import { hashService } from '../adapters/hash.adapter'
import DbNames from '../config/dbNames'
import { DBTypes } from '../models/db'
import { LoginDtoModel } from '../models/input/auth.input.model'
import { UserServiceModel } from '../models/service/users.service.model'
import { dbService } from '../db/dbService'

export const usersRepository = {
	async getUserById(userId: string) {
		if (!ObjectId.isValid(userId)) {
			return null
		}

		const getUserRes = await dbService.db
			.collection<DBTypes.User>(DbNames.users)
			.findOne({ _id: new ObjectId(userId) })

		return getUserRes
	},

	async getUserByLoginAndPassword(loginDto: LoginDtoModel) {
		const getUserRes = await dbService.db
			.collection<DBTypes.User>(DbNames.users)
			.findOne({ $or: [{ login: loginDto.loginOrEmail }, { email: loginDto.loginOrEmail }] })

		if (!getUserRes) {
			return null
		}

		const isPasswordMath = await hashService.compare(loginDto.password, getUserRes.password)

		if (!isPasswordMath) {
			return null
		}

		return this.mapDbUserToServiceUser(getUserRes)
	},

	async createUser(dto: DBTypes.User) {
		const userRes = await dbService.db.collection(DbNames.users).insertOne(dto)
		return userRes.insertedId.toString()
	},

	async deleteUser(userId: string): Promise<boolean> {
		if (!ObjectId.isValid(userId)) {
			return false
		}

		const result = await dbService.db
			.collection(DbNames.users)
			.deleteOne({ _id: new ObjectId(userId) })

		return result.deletedCount === 1
	},

	mapDbUserToServiceUser(DbUser: WithId<DBTypes.User>): UserServiceModel {
		return {
			id: DbUser._id.toString(),
			login: DbUser.login,
			email: DbUser.email,
			password: DbUser.password,
			createdAt: DbUser.createdAt,
		}
	},
}
