import express, { Response } from 'express'
import { HTTP_STATUSES } from '../config/config'
import { UpdateCommentDtoModel } from '../models/input/comments.input.model'
import { commentsQueryRepository } from '../repositories/comments.queryRepository'
import { commentsService } from '../services/comments.service'
import { authMiddleware } from '../middlewares/auth.middleware'
import { ReqWithParams, ReqWithParamsAndBody } from '../models/common'
import { updateCommentValidation } from '../validators/updateComment.validator'

function getCommentsRouter() {
	const router = express.Router()

	// Return comment by id
	router.get('/:commentId', async (req: ReqWithParams<{ commentId: string }>, res: Response) => {
		const { commentId } = req.params

		const comment = await commentsQueryRepository.getComment(commentId)

		if (!comment) {
			res.sendStatus(HTTP_STATUSES.NOT_FOUNT_404)
			return
		}

		res.status(HTTP_STATUSES.OK_200).send(comment)
	})

	// Update existing comment by id with InputModel
	router.put(
		'/:id',
		authMiddleware,
		updateCommentValidation(),
		async (
			req: ReqWithParamsAndBody<{ commentId: string }, UpdateCommentDtoModel>,
			res: Response,
		) => {
			const commentId = req.params.commentId

			const updateCommentStatus = await commentsService.updateComment(
				req,
				commentId,
				req.body,
			)

			if (updateCommentStatus === 'notOwner') {
				res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
				return
			}

			if (!updateCommentStatus) {
				res.sendStatus(HTTP_STATUSES.NOT_FOUNT_404)
				return
			}

			res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
		},
	)

	// Delete comment specified by id
	router.delete(
		'/:id',
		authMiddleware,
		async (req: ReqWithParams<{ commentId: string }>, res: Response) => {
			const commentId = req.params.commentId

			const deleteCommentStatus = await commentsService.deleteComment(req, commentId)

			if (deleteCommentStatus === 'notOwner') {
				res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
				return
			}

			if (!deleteCommentStatus) {
				res.sendStatus(HTTP_STATUSES.NOT_FOUNT_404)
				return
			}

			res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
		},
	)

	return router
}

export default getCommentsRouter
