import request from 'supertest'
import { app } from '../../src/app'
import { HTTP_STATUSES } from '../../src/config/config'
import RouteNames from '../../src/config/routeNames'
import { resetDbEveryTest } from './common'
import {
	addBlogRequest,
	addPostCommentRequest,
	addPostRequest,
	addUserRequest,
	checkCommentObj,
	loginRequest,
	userEmail,
	userPassword,
} from './utils/utils'

resetDbEveryTest()

describe('Getting a comment', () => {
	it('should return 404 if a comment does not exists', async () => {
		const getCommentRes = await request(app).get(RouteNames.comment('999'))

		expect(getCommentRes.status).toBe(HTTP_STATUSES.NOT_FOUNT_404)
	})

	it('should return an existing comment', async () => {
		const createdBlogRes = await addBlogRequest(app)
		expect(createdBlogRes.status).toBe(HTTP_STATUSES.CREATED_201)
		const blogId = createdBlogRes.body.id

		const createdPostRes = await addPostRequest(app, blogId)
		expect(createdPostRes.status).toBe(HTTP_STATUSES.CREATED_201)
		const postId = createdPostRes.body.id

		const createdUserRes = await addUserRequest(app)
		expect(createdUserRes.status).toBe(HTTP_STATUSES.CREATED_201)
		const loginUserRes = await loginRequest(app, userEmail, userPassword)
		const userToken = loginUserRes.body.accessToken

		const createdCommentRes = await addPostCommentRequest(app, userToken, postId)
		const commentId = createdCommentRes.body.id

		const getCommentRes = await request(app)
			.get(RouteNames.comment(commentId))
			.expect(HTTP_STATUSES.OK_200)

		checkCommentObj(getCommentRes.body, createdUserRes.body.id, createdUserRes.body.login)
	})
})

describe('Updating a comment', () => {
	it('should forbid a request from an unauthorized user', async () => {
		await request(app).put(RouteNames.comment('999')).expect(HTTP_STATUSES.UNAUTHORIZED_401)
	})

	it('should not update a non existing comment', async () => {
		const createdUserRes = await addUserRequest(app)
		expect(createdUserRes.status).toBe(HTTP_STATUSES.CREATED_201)
		const loginUserRes = await loginRequest(app, userEmail, userPassword)
		const userToken = loginUserRes.body.accessToken

		await request(app)
			.post(RouteNames.comment('999'))
			.set('authorization', 'Bearer ' + userToken)
			.expect(HTTP_STATUSES.NOT_FOUNT_404)
	})

	it('should not update a comment if the user is not owner', async () => {
		const createdBlogRes = await addBlogRequest(app)
		expect(createdBlogRes.status).toBe(HTTP_STATUSES.CREATED_201)
		const blogId = createdBlogRes.body.id

		const createdPostRes = await addPostRequest(app, blogId)
		expect(createdPostRes.status).toBe(HTTP_STATUSES.CREATED_201)
		const postId = createdPostRes.body.id

		// User one will create a comment
		const createdUserOneRes = await addUserRequest(app)
		expect(createdUserOneRes.status).toBe(HTTP_STATUSES.CREATED_201)
		const loginUserOneRes = await loginRequest(app, userEmail, userPassword)
		const userOneToken = loginUserOneRes.body.accessToken

		// User two will try to update the comment
		const createdUserTwoRes = await addUserRequest(app, {
			login: 'login-2',
			password: 'password-2',
			email: 'email-2@mail.com',
		})
		expect(createdUserTwoRes.status).toBe(HTTP_STATUSES.CREATED_201)
		const loginUserTwoRes = await loginRequest(app, 'email-2@mail.com', 'password-2')
		const userTwoToken = loginUserTwoRes.body.accessToken

		// User one will create a comment
		const createdCommentRes = await addPostCommentRequest(app, userOneToken, postId)
		const commentId = createdCommentRes.body.id

		// User two will try to update the comment
		const updateCommentRes = await request(app)
			.put(RouteNames.comment(commentId))
			.send(JSON.stringify({ content: 'new content min 20 characters' }))
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.set('authorization', 'Bearer ' + userTwoToken)
			.expect(HTTP_STATUSES.FORBIDDEN_403)
	})

	it('should not update a comment by wrong dto', async () => {
		const createdBlogRes = await addBlogRequest(app)
		expect(createdBlogRes.status).toBe(HTTP_STATUSES.CREATED_201)
		const blogId = createdBlogRes.body.id

		const createdPostRes = await addPostRequest(app, blogId)
		expect(createdPostRes.status).toBe(HTTP_STATUSES.CREATED_201)
		const postId = createdPostRes.body.id

		// User will create a comment
		const createdUserRes = await addUserRequest(app)
		expect(createdUserRes.status).toBe(HTTP_STATUSES.CREATED_201)
		const loginUserRes = await loginRequest(app, userEmail, userPassword)
		const userToken = loginUserRes.body.accessToken

		// User one will create a comment
		const createdCommentRes = await addPostCommentRequest(app, userToken, postId)
		const commentId = createdCommentRes.body.id

		const updateCommentRes = await request(app)
			.put(RouteNames.comment(commentId))
			.send(JSON.stringify({ content: 'WRONG' }))
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.set('authorization', 'Bearer ' + userToken)
			.expect(HTTP_STATUSES.BAD_REQUEST_400)
	})

	it('should update a comment by correct dto', async () => {
		const createdBlogRes = await addBlogRequest(app)
		expect(createdBlogRes.status).toBe(HTTP_STATUSES.CREATED_201)
		const blogId = createdBlogRes.body.id

		const createdPostRes = await addPostRequest(app, blogId)
		expect(createdPostRes.status).toBe(HTTP_STATUSES.CREATED_201)
		const postId = createdPostRes.body.id

		// User will create a comment
		const createdUserRes = await addUserRequest(app)
		expect(createdUserRes.status).toBe(HTTP_STATUSES.CREATED_201)
		const loginUserRes = await loginRequest(app, userEmail, userPassword)
		const userToken = loginUserRes.body.accessToken

		// User one will create a comment
		const createdCommentRes = await addPostCommentRequest(app, userToken, postId)
		const commentId = createdCommentRes.body.id

		const updateCommentRes = await request(app)
			.put(RouteNames.comment(commentId))
			.send(JSON.stringify({ content: 'right content right content' }))
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.set('authorization', 'Bearer ' + userToken)
			.expect(HTTP_STATUSES.NO_CONTENT_204)
	})
})

describe('Deleting a comment', () => {
	it('should forbid a request from an unauthorized user', async () => {
		return request(app).put(RouteNames.comment(''))
	})

	it('should not delete a non existing comment', async () => {
		// User will create a comment
		const createdUserRes = await addUserRequest(app)
		expect(createdUserRes.status).toBe(HTTP_STATUSES.CREATED_201)
		const loginUserRes = await loginRequest(app, userEmail, userPassword)
		const userToken = loginUserRes.body.accessToken

		await request(app)
			.delete(RouteNames.comment('notExist'))
			.set('authorization', 'Bearer ' + userToken)
			.expect(HTTP_STATUSES.NOT_FOUNT_404)
	})

	it('should not delete a comment if the user is not owner', async () => {
		const createdBlogRes = await addBlogRequest(app)
		expect(createdBlogRes.status).toBe(HTTP_STATUSES.CREATED_201)
		const blogId = createdBlogRes.body.id

		const createdPostRes = await addPostRequest(app, blogId)
		expect(createdPostRes.status).toBe(HTTP_STATUSES.CREATED_201)
		const postId = createdPostRes.body.id

		// User one will create a comment
		const createdUserOneRes = await addUserRequest(app)
		expect(createdUserOneRes.status).toBe(HTTP_STATUSES.CREATED_201)
		const loginUserOneRes = await loginRequest(app, userEmail, userPassword)
		const userOneToken = loginUserOneRes.body.accessToken

		// User two will try to delete the comment
		const createdUserTwoRes = await addUserRequest(app, {
			login: 'login-2',
			password: 'password-2',
			email: 'email-2@mail.com',
		})
		expect(createdUserTwoRes.status).toBe(HTTP_STATUSES.CREATED_201)
		const loginUserTwoRes = await loginRequest(app, 'email-2@mail.com', 'password-2')
		const userTwoToken = loginUserTwoRes.body.accessToken

		// User one will delete a comment
		const createdCommentRes = await addPostCommentRequest(app, userOneToken, postId)
		const commentId = createdCommentRes.body.id

		// User two will try to delete the comment
		await request(app)
			.delete(RouteNames.comment(commentId))
			.set('authorization', 'Bearer ' + userTwoToken)
			.expect(HTTP_STATUSES.FORBIDDEN_403)
	})

	it('should delete an existing comment', async () => {
		const createdBlogRes = await addBlogRequest(app)
		expect(createdBlogRes.status).toBe(HTTP_STATUSES.CREATED_201)
		const blogId = createdBlogRes.body.id

		const createdPostRes = await addPostRequest(app, blogId)
		expect(createdPostRes.status).toBe(HTTP_STATUSES.CREATED_201)
		const postId = createdPostRes.body.id

		// User will create a comment
		const createdUserRes = await addUserRequest(app)
		expect(createdUserRes.status).toBe(HTTP_STATUSES.CREATED_201)
		const loginUserRes = await loginRequest(app, userEmail, userPassword)
		const userToken = loginUserRes.body.accessToken

		// User one will create a comment
		const createdCommentRes = await addPostCommentRequest(app, userToken, postId)
		const commentId = createdCommentRes.body.id

		await request(app)
			.delete(RouteNames.comment(commentId))
			.set('authorization', 'Bearer ' + userToken)
			.expect(HTTP_STATUSES.NO_CONTENT_204)
	})
})
