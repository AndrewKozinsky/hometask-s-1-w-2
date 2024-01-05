import request from 'supertest'
import { app } from '../../src/app'
import { HTTP_STATUSES } from '../../src/config/config'
import RouteNames from '../../src/config/routeNames'
import { UpdatePostDtoModel } from '../../src/models/input/posts.input.model'
import { GetPostsOutModel } from '../../src/models/output/posts.output.model'
import { addBlogRequest, addPostRequest, createDtoAddPost } from './common'

const authorizationValue = 'Basic YWRtaW46cXdlcnR5'

beforeEach(async () => {
	await request(app).delete(RouteNames.testingAllData).expect(HTTP_STATUSES.NO_CONTENT_204)
})

describe('Getting all posts', () => {
	it('should return an empty array of posts', async () => {
		const successAnswer: GetPostsOutModel = {
			pagesCount: 0,
			page: 1,
			pageSize: 10,
			totalCount: 0,
			items: [],
		}

		await request(app).get(RouteNames.posts).expect(HTTP_STATUSES.OK_200, successAnswer)
	})

	/*it('should return an array with 2 items after creating 2 posts', async () => {
		const createdBlogRes = await addBlogRequest()
		const blogId = createdBlogRes.body.id

		await addPostRequest(blogId)
		await addPostRequest(blogId)

		const getPostsRes = await request(app).get(RouteNames.posts)
		expect(getPostsRes.status).toBe(HTTP_STATUSES.OK_200)
		expect(getPostsRes.body.length).toBe(2)
	})*/

	/*it('should return an array of objects matching the scheme', async () => {
		const createdBlogRes = await addBlogRequest()
		const blogId = createdBlogRes.body.id

		await addPostRequest(blogId)
		const getPostsRes = await request(app).get(RouteNames.posts)

		checkPostObj(getPostsRes.body[0])
	})*/
})

/*describe('Getting a post', () => {
	it('should return 404 if a post does not exists', async () => {
		const getPostRes = await request(app).get(RouteNames.post('999'))

		expect(getPostRes.status).toBe(HTTP_STATUSES.NOT_FOUNT_404)
	})

	it('should return an existing post', async () => {
		const createdBlogRes = await addBlogRequest()
		const blogId = createdBlogRes.body.id

		const createdPostRes = await addPostRequest(blogId)
		const createdPostId = createdPostRes.body.id

		const getPostRes = await request(app).get(RouteNames.post(createdPostId))
		expect(getPostRes.status).toBe(HTTP_STATUSES.OK_200)

		checkPostObj(getPostRes.body)
	})
})*/

/*describe('Creating a post', () => {
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
})*/

/*describe('Updating a post', () => {
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
})*/

/*describe('Deleting a post', () => {
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
})*/

/*function checkPostObj(postObj: any) {
	expect(postObj._id).toBe(undefined)
	expect(typeof postObj.id).toBe('string')
	expect(typeof postObj.title).toBe('string')
	expect(typeof postObj.shortDescription).toBe('string')
	expect(typeof postObj.content).toBe('string')
	expect(typeof postObj.blogId).toBe('string')
	expect(typeof postObj.blogName).toBe('string')
	expect(postObj.createdAt).toMatch(
		/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/,
	)
}*/
