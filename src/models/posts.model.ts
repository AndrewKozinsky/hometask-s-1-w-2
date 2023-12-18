import { DBTypes } from './db'

export type GetPostsOutModel = DBTypes.Post[]

export type CreatePostDtoModel = {
	title: string
	shortDescription: string
	content: string
	blogId: string
}
export type CreatePostOutModel = DBTypes.Post

export type GetPostOutModel = DBTypes.Post

export type UpdatePostDtoModel = {
	title: string
	shortDescription: string
	content: string
	blogId: string
}
