export type PostOutModel = {
	id: string
	title: string
	shortDescription: string
	content: string
	blogId: string
	blogName: string
	createdAt: string
}

export type GetPostsOutModel = {
	// Общее количество страниц заметок
	pagesCount: number
	// Номер текущей страницы с выводом заметок
	page: number
	// Сколько заметок на странице с выводом заметок
	pageSize: number
	// Общее количество заметок
	totalCount: number
	// Заметки на указанной странице
	items: PostOutModel[]
}

export type CreatePostOutModel = PostOutModel

export type GetPostOutModel = PostOutModel
