export namespace DBTypes {
	export type Blog = {
		// _id: ObjectId
		id: string
		name: string
		description: string
		websiteUrl: string
		createdAt: string
		isMembership: true
	}

	export type Post = {
		// _id: ObjectId
		id: string
		title: string
		shortDescription: string
		content: string
		blogId: string
		blogName: string
		createdAt: string
	}
}
