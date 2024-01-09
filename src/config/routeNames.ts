const RouteNames = {
	blogs: '/blogs',
	blog(id: string) {
		return '/blogs/' + id
	},
	blogPosts(blogId: string) {
		return '/blogs/' + blogId + '/posts'
	},
	posts: '/posts',
	post(id: string) {
		return '/posts/' + id
	},
	users: '/users',
	user(id: string) {
		return '/users/' + id
	},
	auth() {
		return '/auth'
	},
	testing: '/testing',
	testingAllData: '/testing/all-data',
}

export default RouteNames
