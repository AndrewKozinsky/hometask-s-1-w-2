import request from 'supertest'
import { app } from '../../src/app'
import { HTTP_STATUSES } from '../../src/config/config'
import RouteNames from '../../src/config/routeNames'
import { CreateBlogDtoModel, UpdateBlogDtoModel } from '../../src/models/blogs.model'

export const authorizationValue = 'Basic YWRtaW46cXdlcnR5'

beforeEach(async () => {
	await request(app).delete(RouteNames.testingAllData).expect(HTTP_STATUSES.NO_CONTENT_204)
})

describe('Getting all blogs', () => {
	it('should return an empty array of blogs', async () => {
		await request(app).get(RouteNames.blogs).expect(HTTP_STATUSES.OK_200, [])
	})

	it('should return an array with 2 items after creating 2 blogs', async () => {
		await addBlogRequest()
		await addBlogRequest()

		const getBlogsRes = await request(app).get(RouteNames.blogs).expect(HTTP_STATUSES.OK_200)
		expect(getBlogsRes.body.length).toBe(2)
	})

	it('should return an array of objects matching the scheme', async () => {
		await addBlogRequest()

		const getBlogsRes = await request(app).get(RouteNames.blogs)

		checkBlogObj(getBlogsRes.body[0])
	})
})

describe('Getting a blog', () => {
	it("should return a 404 if a blog doesn't exists", async () => {
		const getBlogRes = await request(app)
			.get(RouteNames.blog('999'))
			.expect(HTTP_STATUSES.NOT_FOUNT_404)
	})

	it('should return an existing blog', async () => {
		const createdBlogRes = await addBlogRequest()
		const createdBlogId = createdBlogRes.body.id

		const getBlogRes = await request(app).get(RouteNames.blog(createdBlogId))
		expect(getBlogRes.status).toBe(HTTP_STATUSES.OK_200)
		checkBlogObj(getBlogRes.body)
	})
})

describe('Creating a blog', () => {
	it('should forbid a request from an unauthorized user', async () => {
		await request(app).post(RouteNames.blogs).expect(HTTP_STATUSES.UNAUTHORIZED_401)
	})

	it('create a blog by wrong dto', async () => {
		const createdBlogRes = await addBlogRequest({ websiteUrl: 'samurai.it-incubator' })
		expect(createdBlogRes.status).toBe(HTTP_STATUSES.BAD_REQUEST_400)
	})

	it('should create a blog by correct dto', async () => {
		const createdBlogRes = await addBlogRequest()
		expect(createdBlogRes.status).toBe(HTTP_STATUSES.CREATED_201)

		expect(createdBlogRes.body.name).toEqual(createDtoAddBlog().name)
		expect(createdBlogRes.body.description).toEqual(createDtoAddBlog().description)
		expect(createdBlogRes.body.websiteUrl).toEqual(createDtoAddBlog().websiteUrl)

		// Check if there are 2 blogs after adding another one
		const createdSecondBlogRes = await addBlogRequest()
		expect(createdSecondBlogRes.status).toBe(HTTP_STATUSES.CREATED_201)

		const allBlogsRes = await request(app).get(RouteNames.blogs)
		expect(allBlogsRes.body.length).toBe(2)
	})
})

describe('Updating a blog', () => {
	it('should forbid a request from an unauthorized user', async () => {
		await request(app).put(RouteNames.blog('999')).expect(HTTP_STATUSES.UNAUTHORIZED_401)
	})

	it('should not update a non existing blog', async () => {
		await request(app)
			.post(RouteNames.blog('999'))
			.set('authorization', authorizationValue)
			.expect(HTTP_STATUSES.NOT_FOUNT_404)
	})

	it('should not update a blog by wrong dto', async () => {
		const createdBlogRes = await addBlogRequest()
		const createdBlogId = createdBlogRes.body.id

		await request(app)
			.put(RouteNames.blog(createdBlogId))
			.set('authorization', authorizationValue)
			.expect(HTTP_STATUSES.BAD_REQUEST_400)

		await request(app)
			.put(RouteNames.blog(createdBlogId))
			.send({})
			.set('authorization', authorizationValue)
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.expect(HTTP_STATUSES.BAD_REQUEST_400)

		await request(app)
			.put(RouteNames.blog(createdBlogId))
			.send({})
			.set('authorization', authorizationValue)
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.expect(HTTP_STATUSES.BAD_REQUEST_400)
	})

	it('should update a blog by correct dto', async () => {
		const createdBlogRes = await addBlogRequest()
		expect(createdBlogRes.status).toBe(HTTP_STATUSES.CREATED_201)
		const createdBlogId = createdBlogRes.body.id

		const updateBlogDto: UpdateBlogDtoModel = {
			name: 'new name',
			description: 'new description',
			websiteUrl:
				'https://PPtZN-E4.AVFOCYMGSKTDXCm2UspxKIfkv8IHre6yaItRQ-MeyIUZhlDiPolsQbiMc0uSUiWDB_oSH.N222',
		}

		await request(app)
			.put(RouteNames.blog(createdBlogId))
			.send(updateBlogDto)
			.set('authorization', authorizationValue)
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.expect(HTTP_STATUSES.NO_CONTENT_204)
	})
})

describe('Deleting a blog', () => {
	it('should forbid a request from an unauthorized user', async () => {
		return request(app).delete(RouteNames.blogs)
	})

	it('should not delete a non existing blog', async () => {
		await request(app)
			.delete(RouteNames.blog('999'))
			.set('authorization', authorizationValue)
			.expect(HTTP_STATUSES.NOT_FOUNT_404)
	})

	it('should delete a blog', async () => {
		const createdBlogRes = await addBlogRequest()
		expect(createdBlogRes.status).toBe(HTTP_STATUSES.CREATED_201)
		const createdBlogId = createdBlogRes.body.id

		await request(app)
			.delete(RouteNames.blog(createdBlogId))
			.set('authorization', authorizationValue)
			.expect(HTTP_STATUSES.NO_CONTENT_204)

		await request(app).get(RouteNames.blog(createdBlogId)).expect(HTTP_STATUSES.NOT_FOUNT_404)
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

function checkBlogObj(blogObj: any) {
	expect(typeof blogObj.id).toBe('string')
	expect(typeof blogObj.name).toBe('string')
	expect(typeof blogObj.description).toBe('string')
	expect(blogObj.createdAt).toMatch(
		/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/,
	)
	expect(typeof blogObj.websiteUrl).toBe('string')
}
