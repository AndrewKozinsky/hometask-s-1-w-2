import { ObjectId, WithId } from 'mongodb'
import { hashService } from '../adapters/hash.adapter'
import DbNames from '../config/dbNames'
import { DBTypes } from '../models/db'
import { AuthLoginDtoModel } from '../models/input/authLogin.input.model'
import { UserServiceModel } from '../models/service/users.service.model'
import { db, dbService } from '../db/dbService'
import { commonService } from '../services/common'

export const usersRepository = {
	async getUserById(userId: string) {
		if (!ObjectId.isValid(userId)) {
			return null
		}

		const getUserRes = await db
			.collection<DBTypes.User>(DbNames.users)
			.findOne({ _id: new ObjectId(userId) })

		if (!getUserRes) return null

		return this.mapDbUserToServiceUser(getUserRes)
	},

	async createUser(dto: DBTypes.User) {
		return commonService.createUser(dto)
	},

	async deleteUser(userId: string): Promise<boolean> {
		return commonService.deleteUser(userId)
	},

	mapDbUserToServiceUser(dbUser: WithId<DBTypes.User>): UserServiceModel {
		return commonService.mapDbUserToServiceUser(dbUser)
	},
}
