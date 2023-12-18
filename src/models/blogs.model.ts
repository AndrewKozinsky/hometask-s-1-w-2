import { DBTypes } from './db'

export type GetBlogsOutModel = DBTypes.Blog[]

export type CreateBlogDtoModel = {
	name: string
	description: string
	websiteUrl: string
}
export type CreateBlogOutModel = DBTypes.Blog

export type GetBlogOutModel = DBTypes.Blog

export type UpdateBlogDtoModel = {
	name: string
	description: string
	websiteUrl: string
}
