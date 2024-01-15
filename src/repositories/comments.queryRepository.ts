import { Filter, ObjectId, WithId } from 'mongodb'
import DbNames from '../config/dbNames'
import { DBTypes } from '../models/db'
import { GetUsersQueries } from '../models/input/users.input.model'
import { CommentOutModel, GetCommentOutModel } from '../models/output/comments.output.model'
import {
	GetUserOutModel,
	GetUsersOutModel,
	UserOutModel,
} from '../models/output/users.output.model'
import { db, dbService } from '../db/dbService'

export const commentsQueryRepository = {
	async getComment(commentId: string): Promise<null | GetCommentOutModel> {
		if (!ObjectId.isValid(commentId)) {
			return null
		}

		const getCommentRes = await db
			.collection<DBTypes.Comment>(DbNames.comments)
			.findOne({ _id: new ObjectId(commentId) })

		return getCommentRes ? this.mapDbCommentToOutputComment(getCommentRes) : null
	},

	mapDbCommentToOutputComment(DbComment: WithId<DBTypes.Comment>): CommentOutModel {
		return {
			id: DbComment._id.toString(),
			content: DbComment.content,
			commentatorInfo: {
				userId: DbComment.commentatorInfo.userId,
				userLogin: DbComment.commentatorInfo.userLogin,
			},
			createdAt: DbComment.createdAt,
		}
	},
}
