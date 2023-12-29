import { ObjectId } from 'mongodb'
import DbNames from '../config/dbNames'
import { DBTypes } from '../models/db'
import { CreatePostDtoModel, UpdatePostDtoModel } from '../models/posts.model'
import { db } from './db'

export const postsRepository = {
	async getPosts() {
		return await db.collection(DbNames.posts).find({}).toArray()
	},

	async getPostById(postId: string) {
		if (!ObjectId.isValid(postId)) {
			return null
		}

		return await db
			.collection<DBTypes.Post>(DbNames.posts)
			.findOne({ _id: new ObjectId(postId) })
	},

	async createPost(dto: CreatePostDtoModel) {
		return db.collection(DbNames.posts).insertOne(dto)
	},

	async updatePost(postId: string, updatePostDto: UpdatePostDtoModel): Promise<boolean> {
		const updatePostRes = await db
			.collection<DBTypes.Post>(DbNames.posts)
			.updateOne({ id: postId }, { $set: updatePostDto })

		return updatePostRes.matchedCount === 0
	},

	async deletePost(postId: string): Promise<boolean> {
		const result = await db.collection(DbNames.posts).deleteOne({ id: postId })

		return result.deletedCount === 1
	},
}
