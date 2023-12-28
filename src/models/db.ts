import { ObjectId } from 'mongodb'

export namespace DBTypes {
	export type Blog = {
		_id: ObjectId
		name: string
		description: string
		websiteUrl: string
		createdAt: string
		isMembership: boolean
	}

	export type Post = {
		_id: ObjectId
		title: string
		shortDescription: string
		content: string
		blogId: string
		blogName: string
		createdAt: string
	}
}
