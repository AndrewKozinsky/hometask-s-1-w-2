import { ObjectId, WithId } from 'mongodb'
import DbNames from '../config/dbNames'
import { DBTypes } from '../models/db'
import {
	BlogOutModel,
	GetBlogOutModel,
	GetBlogsOutModel,
} from '../models/output/blogs.output.model'
import { db } from './db'

export const blogsQueryRepository = {
	async getBlogs(): Promise<GetBlogsOutModel> {
		const getBlogsRes = await db.collection<BlogOutModel>(DbNames.blogs).find({}).toArray()

		return getBlogsRes.map(this.mapDbBlogToOutputBlog)
	},

	async getBlog(blogId: string): Promise<null | GetBlogOutModel> {
		if (!ObjectId.isValid(blogId)) {
			return null
		}

		const getBlogRes = await db
			.collection<DBTypes.Blog>(DbNames.blogs)
			.findOne({ _id: new ObjectId(blogId) })

		return getBlogRes ? this.mapDbBlogToOutputBlog(getBlogRes) : null
	},

	mapDbBlogToOutputBlog(DbBlog: WithId<DBTypes.Blog>): BlogOutModel {
		return {
			id: DbBlog._id.toString(),
			name: DbBlog.name,
			description: DbBlog.description,
			websiteUrl: DbBlog.websiteUrl,
			createdAt: DbBlog.createdAt,
			isMembership: DbBlog.isMembership,
		}
	},
}
