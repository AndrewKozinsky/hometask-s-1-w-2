export type CommentOutModel = {
	id: string
	content: string
	commentatorInfo: {
		userId: string
		userLogin: string
	}
	createdAt: string
}

export type GetCommentOutModel = CommentOutModel