import { CreatePostDtoModel, UpdatePostDtoModel } from '../models/input/posts.input.model'
import { PostOutModel } from '../models/output/posts.output.model'
import { blogsRepository } from '../repositories/blogs.repository'
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
