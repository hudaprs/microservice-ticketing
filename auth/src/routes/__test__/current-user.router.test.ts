// Supertest
import request from 'supertest'

// App
import { app } from '../../app'

// Router
import { USER_URL } from '../'

it('Current User should be returning 401 when unauthenticated', () => {
	return request(app).get(`${USER_URL}/current-user`).expect(401)
})

it('Current user should be returning 200 when success', async () => {
	const cookie = await global.signIn()

	const response = await request(app)
		.get(`${USER_URL}/current-user`)
		.set('Cookie', cookie)
		.expect(200)

	expect(response.body.email).toBe('test@gmail.com')
})
