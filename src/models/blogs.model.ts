export type BlogOutModel = {
	id: string
	name: string
	description: string
	websiteUrl: string
	createdAt: string
	isMembership: boolean
}

export type GetBlogsOutModel = BlogOutModel[]

export type GetBlogOutModel = BlogOutModel

export type CreateBlogDtoModel = {
	name: string
	description: string
	websiteUrl: string
}
export type CreateBlogOutModel = BlogOutModel

export type UpdateBlogDtoModel = {
	name: string
	description: string
	websiteUrl: string
}
