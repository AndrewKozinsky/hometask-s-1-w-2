import { DBTypes } from '../models/db'
import {
	CreatePostDtoModel,
	CreatePostOutModel,
	GetPostOutModel,
	GetPostsOutModel,
	UpdatePostDtoModel,
} from '../models/posts.model'

export const postsRepository = {
	getPosts(db: DBTypes.DB): GetPostsOutModel {
		return db.posts
	},

	createPost(db: DBTypes.DB, dto: CreatePostDtoModel): CreatePostOutModel {
		const newPost: DBTypes.Post = {
			id: new Date().toISOString(),
			title: dto.title,
			shortDescription: dto.shortDescription,
			content: dto.content,
			blogId: dto.blogId,
			blogName: 'unknown',
		}

		db.posts.push(newPost)

		return newPost
	},

	getPost(db: DBTypes.DB, postId: string): undefined | GetPostOutModel {
		return db.posts.find((post) => post.id === postId)
	},

	updatePost(
		db: DBTypes.DB,
		postId: string,
		updatePostDto: UpdatePostDtoModel,
	): null | DBTypes.Post {
		const postIdx = db.posts.findIndex((post) => post.id === postId)

		if (postIdx < 0) {
			return null
		}

		db.posts[postIdx] = Object.assign(db.posts[postIdx], updatePostDto)

		return db.posts[postIdx]
	},

	deletePost(db: DBTypes.DB, postId: string): boolean {
		const postIdx = db.posts.findIndex((post) => post.id === postId)

		if (postIdx < 0) {
			return false
		}

		db.posts = db.posts.splice(postIdx, 1)

		return true
	},
}
