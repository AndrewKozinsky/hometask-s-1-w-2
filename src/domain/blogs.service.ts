import { ObjectId } from 'mongodb'
import {
	BlogOutModel,
	CreateBlogDtoModel,
	CreateBlogOutModel,
	GetBlogOutModel,
	GetBlogsOutModel,
	UpdateBlogDtoModel,
} from '../models/blogs.model'
import { DBTypes } from '../models/db'
import { blogsRepository } from '../repositories/blogs.repository'

export const blogsService = {
	async getBlogs(): Promise<GetBlogsOutModel> {
		const getBlogsRes = await blogsRepository.getBlogs()

		return getBlogsRes.map(convertDbBlogToOutputBlog)
	},

	async createBlog(dto: CreateBlogDtoModel): Promise<null | CreateBlogOutModel> {
		const newBlog: BlogOutModel = {
			id: new Date().toISOString(),
			name: dto.name,
			description: dto.description,
			websiteUrl: dto.websiteUrl,
			createdAt: new Date().toISOString(),
			isMembership: false,
		}

		const createBlogRes = await blogsRepository.createBlog(newBlog)

		const getBlogRes = await blogsRepository.getBlog(createBlogRes.insertedId.toString())
		if (!getBlogRes) return null

		return convertDbBlogToOutputBlog(getBlogRes)
	},

	async getBlog(blogId: string): Promise<null | GetBlogOutModel> {
		if (!ObjectId.isValid(blogId)) {
			return null
		}

		const getBlogRes = await blogsRepository.getBlog(blogId)
		if (!getBlogRes) return null

		return convertDbBlogToOutputBlog(getBlogRes)
	},

	async updateBlog(
		blogId: string,
		updateBlogDto: UpdateBlogDtoModel,
	): Promise<null | BlogOutModel> {
		const updateBlogRes = await blogsRepository.updateBlog(blogId, updateBlogDto)
		if (!updateBlogRes) return null

		const getBlogRes = await blogsRepository.getBlog(blogId)
		if (!getBlogRes) return null

		return convertDbBlogToOutputBlog(getBlogRes)
	},

	async deleteBlog(blogId: string): Promise<boolean> {
		return blogsRepository.deleteBlog(blogId)
	},
}

function convertDbBlogToOutputBlog(DbBlog: DBTypes.Blog): BlogOutModel {
	return {
		id: DbBlog._id.toString(),
		name: DbBlog.name,
		description: DbBlog.description,
		websiteUrl: DbBlog.websiteUrl,
		createdAt: DbBlog.createdAt,
		isMembership: DbBlog.isMembership,
	}
}
