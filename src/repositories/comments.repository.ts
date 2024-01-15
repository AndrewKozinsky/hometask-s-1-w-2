import { ObjectId, WithId } from 'mongodb'
import DbNames from '../config/dbNames'
import { DBTypes } from '../models/db'
import { UpdateCommentDtoModel } from '../models/input/comments.input.model'
import { CommentServiceModel } from '../models/service/comments.service.model'
import { db, dbService } from '../db/dbService'

export const commentsRepository = {
	async getComment(commentId: string) {
		if (!ObjectId.isValid(commentId)) {
			return null
		}

		const getCommentRes = await db
			.collection<DBTypes.Comment>(DbNames.comments)
			.findOne({ _id: new ObjectId(commentId) })

		return getCommentRes ? this.mapDbCommentToClientComment(getCommentRes) : null
	},

	async updateComment(
		commentId: string,
		updateCommentDto: UpdateCommentDtoModel,
	): Promise<boolean> {
		if (!ObjectId.isValid(commentId)) {
			return false
		}

		const updateCommentRes = await db
			.collection<DBTypes.Comment>(DbNames.comments)
			.updateOne({ _id: new ObjectId(commentId) }, { $set: updateCommentDto })

		return updateCommentRes.modifiedCount === 1
	},

	async deleteComment(commentId: string): Promise<boolean> {
		if (!ObjectId.isValid(commentId)) {
			return false
		}

		const result = await db
			.collection(DbNames.comments)
			.deleteOne({ _id: new ObjectId(commentId) })

		return result.deletedCount === 1
	},

	mapDbCommentToClientComment(DbComment: WithId<DBTypes.Comment>): CommentServiceModel {
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
