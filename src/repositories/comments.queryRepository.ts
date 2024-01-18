import { ObjectId, WithId } from 'mongodb'
import DbNames from '../config/dbNames'
import { DBTypes } from '../models/db'
import {
	CommentOutModel,
	GetCommentOutModel,
	GetPostCommentsOutModel,
} from '../models/output/comments.output.model'
import { db } from '../db/dbService'

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
	async getPostComments(postId: string): Promise<null | GetPostCommentsOutModel> {
		if (!ObjectId.isValid(postId)) {
			return null
		}

		/*const getCommentRes = await db
			.collection<DBTypes.Comment>(DbNames.comments)
			.find({ po: new ObjectId(commentId) })*/

		// return getCommentRes ? this.mapDbCommentToOutputComment(getCommentRes) : null
		return {} as GetPostCommentsOutModel
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
