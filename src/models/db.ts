export namespace DBTypes {
	export type DB = {
		blogs: Blog[]
		posts: Post[]
	}

	export type Blog = {
		id: string
		name: string
		description: string
		websiteUrl: string
	}

	export type Post = {
		id: string
		title: string
		shortDescription: string
		content: string
		blogId: string
		blogName: string
	}
}
