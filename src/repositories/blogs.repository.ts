import {
	CreateBlogDtoModel,
	CreateBlogOutModel,
	GetBlogOutModel,
	GetBlogsOutModel,
	UpdateBlogDtoModel,
} from '../models/blogs.model'
import { DBTypes } from '../models/db'

export const blogsRepository = {
	getBlogs(db: DBTypes.DB): GetBlogsOutModel {
		return db.blogs
	},

	createBlog(db: DBTypes.DB, dto: CreateBlogDtoModel): CreateBlogOutModel {
		const newBlog: DBTypes.Blog = {
			id: new Date().toISOString(),
			name: dto.name,
			description: dto.description,
			websiteUrl: dto.websiteUrl,
		}

		db.blogs.push(newBlog)

		return newBlog
	},

	getBlog(db: DBTypes.DB, blogId: string): undefined | GetBlogOutModel {
		return db.blogs.find((blog) => blog.id === blogId)
	},

	updateBlog(
		db: DBTypes.DB,
		blogId: string,
		updateBlogDto: UpdateBlogDtoModel,
	): null | DBTypes.Blog {
		const blogIdx = db.blogs.findIndex((blog) => blog.id === blogId)

		if (blogIdx < 0) {
			return null
		}

		db.blogs[blogIdx] = Object.assign(db.blogs[blogIdx], updateBlogDto)

		return db.blogs[blogIdx]
	},

	deleteBlog(db: DBTypes.DB, blogId: string): boolean {
		const blogIdx = db.blogs.findIndex((blog) => blog.id === blogId)

		if (blogIdx < 0) {
			return false
		}

		db.blogs.splice(blogIdx, 1)
		debugger

		return true
	},
}
