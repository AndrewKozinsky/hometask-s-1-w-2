import request from 'supertest'
import { app } from '../../src/app'
import { HTTP_STATUSES } from '../../src/config/config'
import RouteNames from '../../src/config/routeNames'
import { dbService } from '../../src/db/dbService'
import { CreatePostDtoModel } from '../../src/models/input/posts.input.model'
import { GetPostsOutModel } from '../../src/models/output/posts.output.model'
import { clearAllDB } from './utils/db'
import { addBlogRequest, addPostRequest, authorizationValue, checkPostObj } from './utils/utils'

beforeAll(async () => {
	await dbService.runMongoMemoryDb()
})

beforeEach(async () => {
	await clearAllDB(app)
})

describe('Getting all posts', () => {
	it('123', async () => {
		expect(2).toBe(2)
	})
	/*it('should return an object with property items contains an empty array', async () => {
		const successAnswer: GetPostsOutModel = {
			pagesCount: 0,
			page: 1,
			pageSize: 10,
			totalCount: 0,
			items: [],
		}

		await request(app).get(RouteNames.posts).expect(HTTP_STATUSES.OK_200, successAnswer)
	})*/
	/*it('should return an object with property items contains array with 2 items after creating 2 posts', async () => {
		const createdBlogRes = await addBlogRequest(app)
		const blogId = createdBlogRes.body.id

		await addPostRequest(app, blogId)
		await addPostRequest(app, blogId)

		const getPostsRes = await request(app).get(RouteNames.posts).expect(HTTP_STATUSES.OK_200)

		expect(getPostsRes.body.pagesCount).toBe(1)
		expect(getPostsRes.body.page).toBe(1)
		expect(getPostsRes.body.pageSize).toBe(10)
		expect(getPostsRes.body.totalCount).toBe(2)
		expect(getPostsRes.body.items.length).toBe(2)

		checkPostObj(getPostsRes.body.items[0])
		checkPostObj(getPostsRes.body.items[1])
	})*/
	/*it('should return an array of objects matching the scheme', async () => {
		const createdBlogRes = await addBlogRequest(app)
		const blogId = createdBlogRes.body.id

		await addPostRequest(app, blogId)
		await addPostRequest(app, blogId)
		await addPostRequest(app, blogId)
		await addPostRequest(app, blogId)
		await addPostRequest(app, blogId)
		await addPostRequest(app, blogId)
		await addPostRequest(app, blogId)

		const getPostsRes = await request(app).get(RouteNames.posts + '?pageNumber=2&pageSize=2')

		expect(getPostsRes.body.page).toBe(2)
		expect(getPostsRes.body.pagesCount).toBe(4)
		expect(getPostsRes.body.totalCount).toBe(7)
		expect(getPostsRes.body.items.length).toBe(2)
	})*/
})

/*describe('Creating a post', () => {
	it('should forbid a request from an unauthorized user', async () => {
		await request(app).post(RouteNames.posts).expect(HTTP_STATUSES.UNAUTHORIZED_401)
	})

	it('should not create a post by wrong dto', async () => {
		const createdBlogRes = await addBlogRequest(app)
		const blogId = createdBlogRes.body.id

		const createdPostRes = await addPostRequest(app, blogId, { title: '' })
		expect(createdPostRes.status).toBe(HTTP_STATUSES.BAD_REQUEST_400)

		expect({}.toString.call(createdPostRes.body.errorsMessages)).toBe('[object Array]')
		expect(createdPostRes.body.errorsMessages.length).toBe(1)
		expect(createdPostRes.body.errorsMessages[0].field).toBe('title')
	})

	it('should create a post by correct dto', async () => {
		const createdBlogRes = await addBlogRequest(app)
		const blogId = createdBlogRes.body.id

		const createdPostRes = await addPostRequest(app, blogId)
		expect(createdPostRes.status).toBe(HTTP_STATUSES.CREATED_201)

		checkPostObj(createdPostRes.body)

		// Check if there are 2 posts after adding another one
		const createdPost2Res = await addPostRequest(app, blogId)
		expect(createdPost2Res.status).toBe(HTTP_STATUSES.CREATED_201)

		const allPostsRes = await request(app).get(RouteNames.posts)
		expect(allPostsRes.body.items.length).toBe(2)
	})
})*/

/*describe('Getting a post', () => {
	it('should return 404 if a post does not exists', async () => {
		const getPostRes = await request(app).get(RouteNames.post('999'))

		expect(getPostRes.status).toBe(HTTP_STATUSES.NOT_FOUNT_404)
	})

	it('should return an existing post', async () => {
		const createdBlogRes = await addBlogRequest(app)
		const blogId = createdBlogRes.body.id

		const createdPostRes = await addPostRequest(app, blogId)
		expect(createdPostRes.status).toBe(HTTP_STATUSES.CREATED_201)
		const createdPostId = createdPostRes.body.id

		const getPostRes = await request(app).get(RouteNames.post(createdPostId))
		expect(getPostRes.status).toBe(HTTP_STATUSES.OK_200)

		checkPostObj(getPostRes.body)
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
		const createdBlogRes = await addBlogRequest(app)
		const blogId = createdBlogRes.body.id

		const createdPostRes = await addPostRequest(app, blogId)
		const createdPostId = createdPostRes.body.id

		await request(app)
			.put(RouteNames.post(createdPostId))
			.send({})
			.set('authorization', authorizationValue)
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.expect(HTTP_STATUSES.BAD_REQUEST_400)
	})

	it('should update a post by correct dto', async () => {
		const createdBlogRes = await addBlogRequest(app)
		const blogId = createdBlogRes.body.id

		const createdPostRes = await addPostRequest(app, blogId)
		expect(createdPostRes.status).toBe(HTTP_STATUSES.CREATED_201)
		const createdPostId = createdPostRes.body.id

		const updatePostDto: CreatePostDtoModel = {
			title: 'UPDATED title',
			shortDescription: 'UPDATED shortDescription',
			content: 'UPDATED content',
			blogId,
		}

		await request(app)
			.put(RouteNames.post(createdPostId))
			.send(updatePostDto)
			.set('authorization', authorizationValue)
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.expect(HTTP_STATUSES.NO_CONTENT_204)

		const getPostRes = await request(app).get(RouteNames.post(createdPostId))

		expect(getPostRes.status).toBe(HTTP_STATUSES.OK_200)
		expect(getPostRes.body.title).toBe(updatePostDto.title)
		expect(getPostRes.body.shortDescription).toBe(updatePostDto.shortDescription)
		expect(getPostRes.body.content).toBe(updatePostDto.content)
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
		const createdBlogRes = await addBlogRequest(app)
		const blogId = createdBlogRes.body.id

		const createdPostRes = await addPostRequest(app, blogId)
		expect(createdPostRes.status).toBe(HTTP_STATUSES.CREATED_201)
		const createdPostId = createdPostRes.body.id

		await request(app)
			.delete(RouteNames.post(createdPostId))
			.set('authorization', authorizationValue)
			.expect(HTTP_STATUSES.NO_CONTENT_204)

		await request(app).get(RouteNames.post(createdPostId)).expect(HTTP_STATUSES.NOT_FOUNT_404)
	})
})*/
