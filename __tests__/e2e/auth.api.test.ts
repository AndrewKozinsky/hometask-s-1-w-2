import request from 'supertest'
import { app } from '../../src/app'
import { HTTP_STATUSES } from '../../src/config/config'
import RouteNames from '../../src/config/routeNames'
import { addUserRequest, clearAllDB } from './common'

beforeEach(async () => {
	await clearAllDB()
})

describe('Login user', () => {
	it('should return 400 if to pass wrong dto', async () => {
		await request(app)
			.post(RouteNames.authLogin)
			.send({ loginOrEmail: '', password: 'password' })
			.expect(HTTP_STATUSES.BAD_REQUEST_400)
	})

	it('should return 400 if the login is wrong', async () => {
		const login = 'login'
		const password = 'password'
		const email = 'email@email.ru'

		const createdUserRes = await addUserRequest({ login, password, email })
		expect(createdUserRes.status).toBe(HTTP_STATUSES.CREATED_201)

		await request(app)
			.post(RouteNames.authLogin)
			.send({ loginOrEmail: login + 'wrong', password })
			.expect(HTTP_STATUSES.UNAUTHORIZED_401)
	})

	it('should return 400 if the password is wrong', async () => {
		const login = 'login'
		const password = 'password'
		const email = 'email@email.ru'

		const createdUserRes = await addUserRequest({ login, password, email })
		expect(createdUserRes.status).toBe(HTTP_STATUSES.CREATED_201)

		await request(app)
			.post(RouteNames.authLogin)
			.send({ loginOrEmail: login, password: password + 'wrong' })
			.expect(HTTP_STATUSES.UNAUTHORIZED_401)
	})

	it('should return 201 if the DTO is correct', async () => {
		const login = 'login'
		const password = 'password'
		const email = 'email@email.ru'

		const createdUserRes = await addUserRequest({ login, password, email })
		expect(createdUserRes.status).toBe(HTTP_STATUSES.CREATED_201)

		await request(app)
			.post(RouteNames.authLogin)
			.send({ loginOrEmail: login, password })
			.expect(HTTP_STATUSES.NO_CONTENT_204)
	})
})
