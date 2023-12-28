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
import { blogsRepository } from '../repositories/blogs.repository'
import { client, db } from '../repositories/db'
import { postsRepository } from '../repositories/posts.repository'

export const postsService = {
	async getPosts(): Promise<GetPostsOutModel> {
		const getPostsRes = await postsRepository.getPosts()

		return getPostsRes.map(convertDbPostToOutputPost)
	},

	async createPost(dto: CreatePostDtoModel): Promise<null | CreatePostOutModel> {
		const blog = await blogsRepository.getBlog(dto.blogId)

		const newPostDto: PostOutModel = {
			id: new Date().toISOString(),
			title: dto.title,
			shortDescription: dto.shortDescription,
			content: dto.content,
			blogId: dto.blogId,
			blogName: blog!.name,
			createdAt: new Date().toISOString(),
		}

		const createPostRes = await postsRepository.createPost(newPostDto)

		const getPostRes = await postsRepository.getPost(createPostRes.insertedId.toString())
		if (!getPostRes) return null

		return convertDbPostToOutputPost(getPostRes)
	},

	async getPost(postId: string): Promise<null | GetPostOutModel> {
		if (!ObjectId.isValid(postId)) {
			return null
		}

		const getPostRes = await postsRepository.getPost(postId)
		if (!getPostRes) return null

		return convertDbPostToOutputPost(getPostRes)
	},

	async updatePost(
		postId: string,
		updatePostDto: UpdatePostDtoModel,
	): Promise<null | PostOutModel> {
		const updatePostRes = await postsRepository.updatePost(postId, updatePostDto)
		if (!updatePostRes) return null

		const getPostRes = await postsRepository.getPost(postId)
		if (!getPostRes) return null

		return convertDbPostToOutputPost(getPostRes)
	},

	async deletePost(postId: string): Promise<boolean> {
		return postsRepository.deletePost(postId)
	},
}

function convertDbPostToOutputPost(DbPost: DBTypes.Post): PostOutModel {
	return {
		id: DbPost._id.toString(),
		title: DbPost.title,
		shortDescription: DbPost.shortDescription,
		content: DbPost.content,
		blogId: DbPost.blogId,
		blogName: DbPost.blogName,
		createdAt: DbPost.createdAt,
	}
}
