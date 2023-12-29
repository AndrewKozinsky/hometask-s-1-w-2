import { ObjectId, WithId } from 'mongodb'
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

export const postsQueryRepository = {
	async getPosts(): Promise<DBTypes.Post[]> {
		const getPostsRes = await db.collection<DBTypes.Post>(DbNames.posts).find({}).toArray()
		return getPostsRes.map(this.mapDbPostToOutputPost)
	},

	async getPost(postId: string): Promise<null | DBTypes.Post> {
		if (!ObjectId.isValid(postId)) {
			return null
		}

		const getPostRes = await db
			.collection<DBTypes.Post>(DbNames.posts)
			.findOne({ _id: new ObjectId(postId) })

		return getPostRes ? this.mapDbPostToOutputPost(getPostRes) : null
	},

	mapDbPostToOutputPost(DbPost: WithId<DBTypes.Post>): PostOutModel {
		return {
			id: DbPost._id.toString(),
			title: DbPost.title,
			shortDescription: DbPost.shortDescription,
			content: DbPost.content,
			blogId: DbPost.blogId,
			blogName: DbPost.blogName,
			createdAt: DbPost.createdAt,
		}
	},
}
