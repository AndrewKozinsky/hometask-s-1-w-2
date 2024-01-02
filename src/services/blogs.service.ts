import {
	CreateBlogDtoModel,
	CreateBlogPostDtoModel,
	UpdateBlogDtoModel,
} from '../models/input/blogs.input.model'
import { CreatePostDtoModel } from '../models/input/posts.input.model'
import { BlogOutModel } from '../models/output/blogs.output.model'
import { blogsRepository } from '../repositories/blogs.repository'
import { postsService } from './posts.service'

export const blogsService = {
	async createBlog(dto: CreateBlogDtoModel) {
		const newBlog: BlogOutModel = {
			id: new Date().toISOString(),
			name: dto.name,
			description: dto.description,
			websiteUrl: dto.websiteUrl,
			createdAt: new Date().toISOString(),
			isMembership: false,
		}

		const createBlogRes = await blogsRepository.createBlog(newBlog)
		return createBlogRes.insertedId.toString()
	},
	async createBlogPost(blogId: string, postDto: CreateBlogPostDtoModel) {
		const newPostDto: CreatePostDtoModel = { blogId, ...postDto }
		return postsService.createPost(newPostDto)
	},

	async updateBlog(blogId: string, updateBlogDto: UpdateBlogDtoModel) {
		return blogsRepository.updateBlog(blogId, updateBlogDto)
	},

	async deleteBlog(blogId: string): Promise<boolean> {
		return blogsRepository.deleteBlog(blogId)
	},
}
