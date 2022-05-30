// Supertest
import request from 'supertest'

// App
import { app } from '../../app'

// Routes
import { USER_URL } from '../'

it('Sign Up should be return 201', async () => {
	return request(app)
		.post(`${USER_URL}/sign-up`)
		.send({
			email: 'test@test.com',
			password: 'password'
		})
		.expect(201)
})

it('Sign Up should be return 422 when email is invalid', async () => {
	return request(app)
		.post(`${USER_URL}/sign-up`)
		.send({
			email: 'test@test',
			password: 'password'
		})
		.expect(422)
})

it('Sign Up should be return 422 when password is invalid', async () => {
	return request(app)
		.post(`${USER_URL}/sign-up`)
		.send({
			email: 'test@test',
			password: 'p'
		})
		.expect(422)
})

it('Sign Up should be return 400 when email already exists', async () => {
	await request(app)
		.post(`${USER_URL}/sign-up`)
		.send({
			email: 'test@test.com',
			password: 'password'
		})
		.expect(201)

	return request(app)
		.post(`${USER_URL}/sign-up`)
		.send({
			email: 'test@test.com',
			password: 'password'
		})
		.expect(400)
})
