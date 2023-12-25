import DbNames from '../config/dbNames'
import {
	BlogOutModel,
	CreateBlogDtoModel,
	CreateBlogOutModel,
	GetBlogOutModel,
	GetBlogsOutModel,
	UpdateBlogDtoModel,
} from '../models/blogs.model'
import { DBTypes } from '../models/db'
import { db } from './db'

export const blogsRepository = {
	async getBlogs(): Promise<GetBlogsOutModel> {
		const getBlogsRes = await db.collection<DBTypes.Blog>(DbNames.blogs).find({}).toArray()

		return getBlogsRes.map(convertDbBlogToOutputBlog)
	},

	async createBlog(dto: CreateBlogDtoModel): Promise<CreateBlogOutModel> {
		const newBlog: BlogOutModel = {
			id: new Date().toISOString(),
			name: dto.name,
			description: dto.description,
			websiteUrl: dto.websiteUrl,
			createdAt: new Date().toISOString(),
			isMembership: false,
		}

		await db.collection(DbNames.blogs).insertOne(newBlog)

		return convertDbBlogToOutputBlog(newBlog as DBTypes.Blog)
	},

	async getBlog(blogId: string): Promise<null | GetBlogOutModel> {
		const getBlogRes = await db.collection<DBTypes.Blog>(DbNames.blogs).findOne({ id: blogId })

		if (!getBlogRes) return null

		return convertDbBlogToOutputBlog(getBlogRes)
	},

	async updateBlog(
		blogId: string,
		updateBlogDto: UpdateBlogDtoModel,
	): Promise<null | BlogOutModel> {
		const result = await db
			.collection<DBTypes.Blog>(DbNames.blogs)
			.updateOne({ id: blogId }, { $set: updateBlogDto })

		if (result.matchedCount === 0) {
			return null
		}

		const updatedBlog = await this.getBlog(blogId)

		return updatedBlog ? updatedBlog : null
	},

	async deleteBlog(blogId: string): Promise<boolean> {
		const result = await db.collection(DbNames.blogs).deleteOne({ id: blogId })

		return result.deletedCount === 1
	},
}

function convertDbBlogToOutputBlog(DbBlog: DBTypes.Blog): BlogOutModel {
	return {
		id: DbBlog.id,
		name: DbBlog.name,
		description: DbBlog.description,
		websiteUrl: DbBlog.websiteUrl,
		createdAt: DbBlog.createdAt,
		isMembership: DbBlog.isMembership,
	}
}
