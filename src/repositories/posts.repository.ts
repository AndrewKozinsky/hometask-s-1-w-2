import { ObjectId } from 'mongodb'
import DbNames from '../config/dbNames'
import { BlogOutModel } from '../models/blogs.model'
import { DBTypes } from '../models/db'
import {
	CreatePostDtoModel,
	CreatePostOutModel,
	GetPostOutModel,
	GetPostsOutModel,
	PostOutModel,
	UpdatePostDtoModel,
} from '../models/posts.model'
import { blogsRepository } from './blogs.repository'
import { client, db } from './db'

export const postsRepository = {
	async getPosts(): Promise<DBTypes.Post[]> {
		return db.collection<DBTypes.Post>(DbNames.posts).find({}).toArray()
	},

	async createPost(dto: CreatePostDtoModel) {
		return db.collection(DbNames.posts).insertOne(dto)
	},

	async getPost(postId: string): Promise<null | DBTypes.Post> {
		return db.collection<DBTypes.Post>(DbNames.posts).findOne({ _id: new ObjectId(postId) })
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
