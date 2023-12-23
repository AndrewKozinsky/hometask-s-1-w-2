import request from 'supertest'
import { app } from '../../src/app'
import { HTTP_STATUSES } from '../../src/config/config'
import RouteNames from '../../src/config/routeNames'
import { CreateBlogDtoModel, UpdateBlogDtoModel } from '../../src/models/blogs.model'
import { CreatePostDtoModel, UpdatePostDtoModel } from '../../src/models/posts.model'

const authorizationValue = 'Basic YWRtaW46cXdlcnR5'

beforeEach(async () => {
	await request(app).delete(RouteNames.testingAllData).expect(HTTP_STATUSES.NO_CONTENT_204)
})

describe('Getting all posts', () => {
	it('should return an empty array of posts', async () => {
		await request(app).get(RouteNames.posts).expect(HTTP_STATUSES.OK_200, [])
	})

	it('should return an array with 2 items after creating 2 posts', async () => {
		const createdBlogRes = await addBlogRequest()
		const blogId = createdBlogRes.body.id

		await addPostRequest(blogId)
		await addPostRequest(blogId)

		const getPostsRes = await request(app).get(RouteNames.posts)
		expect(getPostsRes.status).toBe(HTTP_STATUSES.OK_200)
		expect(getPostsRes.body.length).toBe(2)
	})
})

describe('Getting a post', () => {
	it("should return 404 if a post doesn't exists", async () => {
		const getPostRes = await request(app).get(RouteNames.post('999'))

		expect(getPostRes.status).toBe(HTTP_STATUSES.NOT_FOUNT_404)
	})

	it('should return an existing post', async () => {
		const createdBlogRes = await addBlogRequest()
		const blogId = createdBlogRes.body.id

		const createdPostRes = await addPostRequest(blogId)
		const createdPostId = createdPostRes.body.id

		await request(app).get(RouteNames.post(createdPostId)).expect(HTTP_STATUSES.OK_200)
	})
})

describe('Creating a post', () => {
	it('should forbid a request from an unauthorized user', async () => {
		await request(app).post(RouteNames.posts).expect(HTTP_STATUSES.UNAUTHORIZED_401)
	})

	it('should not create a post by wrong dto', async () => {
		const createdBlogRes = await addBlogRequest()
		const blogId = createdBlogRes.body.id

		const createdPostRes = await addPostRequest(blogId, { title: '' })
		expect(createdPostRes.status).toBe(HTTP_STATUSES.BAD_REQUEST_400)
	})

	it('should create a post by correct dto', async () => {
		const createdBlogRes = await addBlogRequest()
		const blogId = createdBlogRes.body.id

		const createdPostRes = await addPostRequest(blogId)
		expect(createdPostRes.status).toBe(HTTP_STATUSES.CREATED_201)

		expect(createdPostRes.body.title).toEqual(createDtoAddPost(blogId).title)
		expect(createdPostRes.body.shortDescription).toEqual(
			createDtoAddPost(blogId).shortDescription,
		)
		expect(createdPostRes.body.content).toEqual(createDtoAddPost(blogId).content)

		// Check if there are 2 posts after adding another one
		const createdPost2Res = await addPostRequest(blogId)
		expect(createdPost2Res.status).toBe(HTTP_STATUSES.CREATED_201)
		const allPostsRes = await request(app).get(RouteNames.posts)
		expect(allPostsRes.body.length).toBe(2)
	})
})

describe('Updating a post', () => {
	it('should forbid a request from an unauthorized user', async () => {
		await request(app).put(RouteNames.post('999')).expect(HTTP_STATUSES.UNAUTHORIZED_401)
	})

	it('should not update a non existing post', async () => {
		await request(app)
			.post(RouteNames.post('999'))
			.set('authorization', authorizationValue)
			.expect(HTTP_STATUSES.NOT_FOUNT_404)
	})

	it('should not update a post by wrong dto', async () => {
		const createdBlogRes = await addBlogRequest()
		const blogId = createdBlogRes.body.id

		const createdPostRes = await addPostRequest(blogId)
		const createdPostId = createdPostRes.body.id

		await request(app)
			.put(RouteNames.post(createdPostId))
			.set('authorization', authorizationValue)
			.expect(HTTP_STATUSES.BAD_REQUEST_400)

		await request(app)
			.put(RouteNames.post(createdPostId))
			.send({})
			.set('authorization', authorizationValue)
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.expect(HTTP_STATUSES.BAD_REQUEST_400)

		await request(app)
			.put(RouteNames.post(createdPostId))
			.send({})
			.set('authorization', authorizationValue)
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.expect(HTTP_STATUSES.BAD_REQUEST_400)
	})

	it('should update a post by correct dto', async () => {
		const createdBlogRes = await addBlogRequest()
		const blogId = createdBlogRes.body.id

		const createdPostRes = await addPostRequest(blogId)
		expect(createdPostRes.status).toBe(HTTP_STATUSES.CREATED_201)
		const createdPostId = createdPostRes.body.id

		const updatePostDto: UpdatePostDtoModel = {
			title: 'my string',
			shortDescription: 'my shortDescription',
			content: 'my content',
			blogId,
		}

		await request(app)
			.put(RouteNames.post(createdPostId))
			.send(updatePostDto)
			.set('authorization', authorizationValue)
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.expect(HTTP_STATUSES.NO_CONTENT_204)
	})
})

describe('Deleting a post', () => {
	it('should forbid a request from an unauthorized user', async () => {
		return request(app).put(RouteNames.posts)
	})

	it('should not delete a non existing post', async () => {
		await request(app)
			.delete(RouteNames.post('999'))
			.set('authorization', authorizationValue)
			.expect(HTTP_STATUSES.NOT_FOUNT_404)
	})

	it('should delete a post', async () => {
		const createdBlogRes = await addBlogRequest()
		const blogId = createdBlogRes.body.id

		const createdPostRes = await addPostRequest(blogId)
		expect(createdPostRes.status).toBe(HTTP_STATUSES.CREATED_201)
		const createdPostId = createdPostRes.body.id

		await request(app)
			.delete(RouteNames.post(createdPostId))
			.set('authorization', authorizationValue)
			.expect(HTTP_STATUSES.NO_CONTENT_204)

		await request(app).get(RouteNames.post(createdPostId)).expect(HTTP_STATUSES.NOT_FOUNT_404)
	})
})

async function addBlogRequest(blogDto: Partial<CreateBlogDtoModel> = {}) {
	return request(app)
		.post(RouteNames.blogs)
		.send(createDtoAddBlog(blogDto))
		.set('Content-Type', 'application/json')
		.set('Accept', 'application/json')
		.set('authorization', authorizationValue)
}

function createDtoAddBlog(newBlogObj: Partial<CreateBlogDtoModel> = {}): CreateBlogDtoModel {
	return Object.assign(
		{
			name: 'my name',
			description: 'my description',
			websiteUrl:
				'https://9DKoTEgTwRIyvI8-tVDUU2STaq3OG.e0d6f1EB3XsujFbOW53q5woGXMrAc5zXUnQxWvxsTS6a3zLYZdUWDt-BnXLEs1',
		},
		{ ...newBlogObj },
	)
}

async function addPostRequest(blogId: string, postDto: Partial<CreatePostDtoModel> = {}) {
	return request(app)
		.post(RouteNames.posts)
		.send(createDtoAddPost(blogId, postDto))
		.set('Content-Type', 'application/json')
		.set('Accept', 'application/json')
		.set('authorization', authorizationValue)
}

function createDtoAddPost(
	blogId: string,
	newPostObj: Partial<CreatePostDtoModel> = {},
): CreatePostDtoModel {
	return Object.assign(
		{
			title: 'title',
			shortDescription: 'shortDescription',
			content: 'content',
			blogId,
		},
		newPostObj,
	)
}
