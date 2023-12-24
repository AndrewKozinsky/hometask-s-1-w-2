import { ObjectId } from 'mongodb'
import DbNames from '../config/dbNames'
import {
	CreateBlogDtoModel,
	CreateBlogOutModel,
	GetBlogOutModel,
	GetBlogsOutModel,
	UpdateBlogDtoModel,
} from '../models/blogs.model'
import { DBTypes } from '../models/db'
import { client } from './db'

export const blogsRepository = {
	async getBlogs(): Promise<GetBlogsOutModel> {
		return client
			.db(process.env.MONGO_DB_NAME)
			.collection<DBTypes.Blog>(DbNames.blogs)
			.find({})
			.toArray()
	},

	async createBlog(dto: CreateBlogDtoModel): Promise<CreateBlogOutModel> {
		const newBlog: DBTypes.Blog = {
			id: new Date().toISOString(),
			name: dto.name,
			description: dto.description,
			websiteUrl: dto.websiteUrl,
			createdAt: new Date().toISOString(),
			isMembership: true,
		}

		await client.db(process.env.MONGO_DB_NAME).collection(DbNames.blogs).insertOne(newBlog)

		return newBlog
	},

	async getBlog(blogId: string): Promise<null | GetBlogOutModel> {
		return client
			.db(process.env.MONGO_DB_NAME)
			.collection<DBTypes.Blog>(DbNames.blogs)
			.findOne({ id: blogId })
	},

	async updateBlog(
		blogId: string,
		updateBlogDto: UpdateBlogDtoModel,
	): Promise<null | DBTypes.Blog> {
		const result = await client
			.db(process.env.MONGO_DB_NAME)
			.collection<DBTypes.Blog>(DbNames.blogs)
			.updateOne({ id: blogId }, { $set: updateBlogDto })

		if (result.matchedCount === 0) {
			return null
		}

		const updatedBlog = await this.getBlog(blogId)

		return updatedBlog ? updatedBlog : null
	},

	async deleteBlog(blogId: string): Promise<boolean> {
		const result = await client
			.db(process.env.MONGO_DB_NAME)
			.collection(DbNames.blogs)
			.deleteOne({ id: blogId })

		return result.deletedCount === 1
	},
}
