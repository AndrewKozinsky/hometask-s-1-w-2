import { ObjectId } from 'mongodb'

export namespace DBTypes {
	export type DB = {
		blogs: Blog[]
		posts: Post[]
	}

	export type Blog = {
		// _id: ObjectId
		id: string
		name: string
		description: string
		websiteUrl: string
	}

	export type Post = {
		// _id: ObjectId
		id: string
		title: string
		shortDescription: string
		content: string
		blogId: string
		blogName: string
	}
}
