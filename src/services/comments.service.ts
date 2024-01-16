import { Request } from 'express'
import { UpdateCommentDtoModel } from '../models/input/comments.input.model'
import { CommentServiceModel } from '../models/service/comments.service.model'
import { commentsRepository } from '../repositories/comments.repository'
import { authService } from './auth.service'

export const commentsService = {
	async getComment(commentId: string): Promise<null | CommentServiceModel> {
		return commentsRepository.getComment(commentId)
	},

	async updateComment(
		req: Request,
		commentId: string,
		updateCommentDto: UpdateCommentDtoModel,
	): Promise<'notOwner' | boolean> {
		if (!req.user) return false

		const comment = await commentsRepository.getComment(commentId)
		if (!comment) return false

		if (comment.commentatorInfo.userId !== req.user.id) {
			return 'notOwner'
		}

		return commentsRepository.updateComment(commentId, updateCommentDto)
	},

	async deleteComment(req: Request, commentId: string): Promise<'notOwner' | boolean> {
		if (!req.user) return false

		const comment = await commentsRepository.getComment(commentId)
		if (!comment) return false

		if (comment.commentatorInfo.userId !== req.user.id) {
			return 'notOwner'
		}

		return commentsRepository.deleteComment(commentId)
	},
}
