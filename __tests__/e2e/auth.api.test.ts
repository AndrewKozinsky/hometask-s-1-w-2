import jwt from 'jsonwebtoken'
import request from 'supertest'
import { app } from '../../src/app'
import { HTTP_STATUSES } from '../../src/config/config'
import RouteNames from '../../src/config/routeNames'
import { settings } from '../../src/settings'
import { resetDbEveryTest } from './common'
import { addUserRequest, adminAuthorizationValue, loginRequest } from './utils/utils'

resetDbEveryTest()

it('123', async () => {
	expect(2).toBe(2)
})

describe('Login user', () => {
	it('should return 400 if to pass wrong dto', async () => {
		await request(app)
			.post(RouteNames.authLogin)
			.send({ loginOrEmail: '', password: 'password' })
			.expect(HTTP_STATUSES.BAD_REQUEST_400)
	})

	it('should return 401 if the login is wrong', async () => {
		const login = 'login'
		const password = 'password'
		const email = 'email@email.ru'

		const createdUserRes = await addUserRequest(app, { login, password, email })
		expect(createdUserRes.status).toBe(HTTP_STATUSES.CREATED_201)

		await request(app)
			.post(RouteNames.authLogin)
			.send({ loginOrEmail: login + 'wrong', password })
			.expect(HTTP_STATUSES.UNAUTHORIZED_401)
	})

	it('should return 401 if the password is wrong', async () => {
		const login = 'login'
		const password = 'password'
		const email = 'email@email.ru'

		const createdUserRes = await addUserRequest(app, { login, password, email })
		expect(createdUserRes.status).toBe(HTTP_STATUSES.CREATED_201)

		await request(app)
			.post(RouteNames.authLogin)
			.send({ loginOrEmail: login, password: password + 'wrong' })
			.expect(HTTP_STATUSES.UNAUTHORIZED_401)
	})

	it('should return 200 and object with token if the DTO is correct', async () => {
		const login = 'login'
		const password = 'password'
		const email = 'email@email.ru'

		const createdUserRes = await addUserRequest(app, { login, password, email })
		expect(createdUserRes.status).toBe(HTTP_STATUSES.CREATED_201)

		const loginRes = await loginRequest(app, login, password).expect(HTTP_STATUSES.OK_200)

		const rightToken = jwt.sign({ userId: createdUserRes.body.id }, settings.JWT_SECRET, {
			expiresIn: '1h',
		})
		expect(loginRes.body.accessToken).toBe(rightToken)
	})
})

describe('Get current user', () => {
	it('should forbid a request from an unauthorized user', async () => {
		await request(app).post(RouteNames.blogs).expect(HTTP_STATUSES.UNAUTHORIZED_401)
	})

	it('should return 200 and user data if the DTO is correct', async () => {
		const login = 'login'
		const password = 'password'
		const email = 'email@email.ru'

		const createdUserRes = await addUserRequest(app, { login, password, email })
		expect(createdUserRes.status).toBe(HTTP_STATUSES.CREATED_201)

		const loginRes = await loginRequest(app, login, password).expect(HTTP_STATUSES.OK_200)

		const authMeRes = await request(app)
			.get(RouteNames.authMe)
			.set('authorization', 'Bearer ' + loginRes.body.accessToken)
			.expect(HTTP_STATUSES.OK_200)

		expect(authMeRes.body.email).toBe(email)
		expect(authMeRes.body.login).toBe(login)
		expect(authMeRes.body.userId).toBe(createdUserRes.body.id)
	})
})
