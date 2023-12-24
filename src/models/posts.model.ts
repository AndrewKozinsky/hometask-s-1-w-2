export type PostOutModel = {
	id: string
	title: string
	shortDescription: string
	content: string
	blogId: string
	blogName: string
	createdAt: string
}

export type GetPostsOutModel = PostOutModel[]

export type CreatePostDtoModel = {
	title: string
	shortDescription: string
	content: string
	blogId: string
}
export type CreatePostOutModel = PostOutModel

export type GetPostOutModel = PostOutModel

export type UpdatePostDtoModel = {
	title: string
	shortDescription: string
	content: string
	blogId: string
}
