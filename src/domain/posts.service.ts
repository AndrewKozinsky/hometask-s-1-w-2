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
import { blogsQueryRepository } from '../repositories/blogs.queryRepository'
import { blogsRepository } from '../repositories/blogs.repository'
import { client, db } from '../repositories/db'
import { postsRepository } from '../repositories/posts.repository'

export const postsService = {
	async createPost(dto: CreatePostDtoModel) {
		const blog = await blogsRepository.getBlogById(dto.blogId)

		const newPostDto: PostOutModel = {
			id: new Date().toISOString(),
			title: dto.title,
			shortDescription: dto.shortDescription,
			content: dto.content,
			blogId: dto.blogId,
			blogName: blog!.name,
			createdAt: new Date().toISOString(),
		}

		return postsRepository.createPost(newPostDto)
	},

	async updatePost(postId: string, updatePostDto: UpdatePostDtoModel) {
		return postsRepository.updatePost(postId, updatePostDto)
	},

	async deletePost(postId: string): Promise<boolean> {
		return postsRepository.deletePost(postId)
	},
}
