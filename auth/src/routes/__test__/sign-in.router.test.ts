// Supertest
import request from 'supertest'

// App
import { app } from '../../app'

// Router
import { USER_URL } from '../'

it('Sign In should be return 422 when email invalid', async () => {
	return request(app)
		.post(`${USER_URL}/sign-in`)
		.send({
			email: 'test@test',
			password: 'password'
		})
		.expect(422)
})

it('Sign In should be return 400 when password invalid', async () => {
	return request(app)
		.post(`${USER_URL}/sign-in`)
		.send({
			email: 'test@test.com',
			password: 'p'
		})
		.expect(400)
})

it('Sign In should be return 400 when registered email is invalid', async () => {
	await global.signIn()

	return request(app)
		.post(`${USER_URL}/sign-in`)
		.send({
			email: 'test@test.co',
			password: 'password'
		})
		.expect(400)
})

it('Sign In should be return 400 when registered password is invalid', async () => {
	await global.signIn()

	return request(app)
		.post(`${USER_URL}/sign-in`)
		.send({
			email: 'test@test.com',
			password: 'passwor'
		})
		.expect(400)
})

it('Sign In should be return 200 when success', async () => {
	await global.signIn()
})

it('Sign In should be set Set-Cookie in headers when success', async () => {
	const cookie = await global.signIn()

	expect(cookie).toBeDefined()
})
