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
import { client } from './db'

export const postsRepository = {
	async getPosts(): Promise<GetPostsOutModel> {
		const getPostsRes = await client
			.db(process.env.MONGO_DB_NAME)
			.collection<DBTypes.Post>(DbNames.posts)
			.find({})
			.toArray()

		return getPostsRes.map(convertDbPostToOutputPost)
	},

	async createPost(dto: CreatePostDtoModel): Promise<CreatePostOutModel> {
		let blog = await blogsRepository.getBlog(dto.blogId)
		blog = blog as DBTypes.Blog

		const newPost: PostOutModel = {
			id: new Date().toISOString(),
			title: dto.title,
			shortDescription: dto.shortDescription,
			content: dto.content,
			blogId: dto.blogId,
			blogName: blog.name,
			createdAt: new Date().toISOString(),
		}

		await client.db(process.env.MONGO_DB_NAME).collection(DbNames.posts).insertOne(newPost)

		return convertDbPostToOutputPost(newPost as DBTypes.Post)
	},

	async getPost(postId: string): Promise<null | GetPostOutModel> {
		const getPostRes = await client
			.db(process.env.MONGO_DB_NAME)
			.collection<DBTypes.Post>(DbNames.posts)
			.findOne({ id: postId })

		if (!getPostRes) return null

		return convertDbPostToOutputPost(getPostRes)
	},

	async updatePost(
		postId: string,
		updatePostDto: UpdatePostDtoModel,
	): Promise<null | PostOutModel> {
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

function convertDbPostToOutputPost(DbPost: DBTypes.Post): PostOutModel {
	return {
		id: DbPost.id,
		title: DbPost.title,
		shortDescription: DbPost.shortDescription,
		content: DbPost.content,
		blogId: DbPost.blogId,
		blogName: DbPost.blogName,
		createdAt: DbPost.createdAt,
	}
}
