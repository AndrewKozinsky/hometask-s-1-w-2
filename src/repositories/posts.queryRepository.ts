import { Filter, ObjectId, WithId } from 'mongodb'
import DbNames from '../config/dbNames'
import { DBTypes } from '../models/db'
import { GetBlogsQueries } from '../models/input/blogs.input.model'
import { GetPostsParams } from '../models/input/posts.input.model'
import { BlogOutModel } from '../models/output/blogs.output.model'
import {
	GetPostOutModel,
	GetPostsOutModel,
	PostOutModel,
} from '../models/output/posts.output.model'
import { db } from './db'

export const postsQueryRepository = {
	async getPosts(params: GetPostsParams): Promise<GetPostsOutModel> {
		const sortBy = params.sortBy ?? 'createdAt'
		const sortDirection = params.sortDirection ?? 'desc'

		const pageNumber = params.pageNumber ?? 1
		const pageSize = params.pageSize ?? 10

		const totalPostsCount = await db.collection(DbNames.posts).countDocuments({})
		const pagesCount = Math.ceil(totalPostsCount / pageSize)

		const getPostsRes = await db
			.collection<DBTypes.Post>(DbNames.posts)
			.find({})
			.sort(sortBy, sortDirection)
			.skip((pageNumber - 1) * pageSize)
			.limit(pageSize)
			.toArray()

		return {
			pagesCount,
			page: pageNumber,
			pageSize,
			totalCount: totalPostsCount,
			items: getPostsRes.map(this.mapDbPostToOutputPost),
		}
	},

	async getPost(postId: string): Promise<null | GetPostOutModel> {
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
