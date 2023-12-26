export namespace DBTypes {
	export type Blog = {
		// _id: string
		id: string
		name: string
		description: string
		websiteUrl: string
		createdAt: string
		isMembership: boolean
	}

	export type Post = {
		// _id: string
		id: string
		title: string
		shortDescription: string
		content: string
		blogId: string
		blogName: string
		createdAt: string
	}
}
