import { ObjectId } from 'mongodb'
import DbNames from '../config/dbNames'
import { DBTypes } from '../models/db'
import {
	CreatePostDtoModel,
	CreatePostOutModel,
	GetPostOutModel,
	GetPostsOutModel,
	UpdatePostDtoModel,
} from '../models/posts.model'
import { blogsRepository } from './blogs.repository'
import { client } from './db'

export const postsRepository = {
	async getPosts(): Promise<GetPostsOutModel> {
		return await client
			.db(process.env.MONGO_DB_NAME)
			.collection<DBTypes.Post>(DbNames.posts)
			.find({})
			.toArray()
	},

	async createPost(dto: CreatePostDtoModel): Promise<CreatePostOutModel> {
		let blog = await blogsRepository.getBlog(dto.blogId)
		blog = blog as DBTypes.Blog

		const newPost: DBTypes.Post = {
			id: new Date().toISOString(),
			title: dto.title,
			shortDescription: dto.shortDescription,
			content: dto.content,
			blogId: dto.blogId,
			blogName: blog.name,
		}

		await client.db(process.env.MONGO_DB_NAME).collection(DbNames.posts).insertOne(newPost)
		return newPost
	},

	async getPost(postId: string): Promise<null | GetPostOutModel> {
		return client
			.db(process.env.MONGO_DB_NAME)
			.collection<DBTypes.Post>(DbNames.posts)
			.findOne({ id: postId })
	},

	async updatePost(
		postId: string,
		updatePostDto: UpdatePostDtoModel,
	): Promise<null | DBTypes.Post> {
		const result = await client
			.db(process.env.MONGO_DB_NAME)
			.collection<DBTypes.Post>(DbNames.posts)
			.updateOne({ id: postId }, { $set: updatePostDto })

		if (result.matchedCount === 0) {
			return null
		}

		const updatedBlog = await this.getPost(postId)

		return updatedBlog ? updatedBlog : null
	},

	async deletePost(postId: string): Promise<boolean> {
		const result = await client
			.db(process.env.MONGO_DB_NAME)
			.collection(DbNames.posts)
			.deleteOne({ id: postId })

		return result.deletedCount === 1
	},
}
