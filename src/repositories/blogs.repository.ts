import { ObjectId } from 'mongodb'
import DbNames from '../config/dbNames'
import { BlogOutModel, UpdateBlogDtoModel } from '../models/blogs.model'
import { DBTypes } from '../models/db'
import { db } from './db'

export const blogsRepository = {
	async getBlogs() {
		return db.collection<BlogOutModel>(DbNames.blogs).find({}).toArray()
	},
	async getBlogById(blogId: string) {
		return db.collection<DBTypes.Blog>(DbNames.blogs).findOne({ _id: new ObjectId(blogId) })
	},
	async createBlog(dto: BlogOutModel) {
		return db.collection(DbNames.blogs).insertOne(dto)
	},

	async updateBlog(blogId: string, updateBlogDto: UpdateBlogDtoModel): Promise<boolean> {
		const updateBlogRes = await db
			.collection<DBTypes.Blog>(DbNames.blogs)
			.updateOne({ id: blogId }, { $set: updateBlogDto })

		return updateBlogRes.matchedCount === 0
	},

	async deleteBlog(blogId: string): Promise<boolean> {
		const result = await db.collection(DbNames.blogs).deleteOne({ _id: new ObjectId(blogId) })

		return result.deletedCount === 1
	},
}
