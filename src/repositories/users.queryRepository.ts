import { Filter, ObjectId, WithId } from 'mongodb'
import DbNames from '../config/dbNames'
import { DBTypes } from '../models/db'
import { GetUsersQueries } from '../models/input/users.input.model'
import {
	GetUserOutModel,
	GetUsersOutModel,
	UserOutModel,
} from '../models/output/users.output.model'
import { db } from './db'

export const usersQueryRepository = {
	async getUsers(queries: GetUsersQueries): Promise<GetUsersOutModel> {
		const filter: Filter<DBTypes.User> = {}

		if (queries.searchLoginTerm) {
			filter.login = { $regex: queries.searchLoginTerm, $options: 'i' }
		}
		if (queries.searchEmailTerm) {
			filter.email = { $regex: queries.searchEmailTerm, $options: 'i' }
		}

		const sortBy = queries.sortBy ?? 'createdAt'
		const sortDirection = queries.sortDirection ?? 'desc'

		const pageNumber = queries.pageNumber ? +queries.pageNumber : 1
		const pageSize = queries.pageSize ? +queries.pageSize : 10

		const totalUsersCount = await db.collection(DbNames.users).countDocuments()

		const pagesCount = Math.ceil(totalUsersCount / pageSize)

		const getUsersRes = await db
			.collection<DBTypes.User>(DbNames.users)
			.find(filter)
			.sort(sortBy, sortDirection)
			.skip((pageNumber - 1) * pageSize)
			.limit(pageSize)
			.toArray()

		return {
			pagesCount,
			page: pageNumber,
			pageSize,
			totalCount: totalUsersCount,
			items: getUsersRes.map(this.mapDbUserToOutputUser),
		}
	},

	async getUser(postId: string): Promise<null | GetUserOutModel> {
		if (!ObjectId.isValid(postId)) {
			return null
		}

		const getUserRes = await db
			.collection<DBTypes.User>(DbNames.users)
			.findOne({ _id: new ObjectId(postId) })

		return getUserRes ? this.mapDbUserToOutputUser(getUserRes) : null
	},

	mapDbUserToOutputUser(DbUser: WithId<DBTypes.User>): UserOutModel {
		return {
			id: DbUser._id.toString(),
			email: DbUser.email,
			login: DbUser.login,
			createdAt: DbUser.createdAt,
		}
	},
}
