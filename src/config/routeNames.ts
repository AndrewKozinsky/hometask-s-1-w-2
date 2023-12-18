const RouteNames = {
	blogs: '/blogs',
	blog(id: string) {
		return '/blogs/' + id
	},
	posts: {
		root: '/posts',
	},
	post(id: string) {
		return '/post/' + id
	},
	testing: '/testing',
	testingAllData: '/testing/all-data',
}

export default RouteNames
