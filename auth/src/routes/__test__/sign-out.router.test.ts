// Supertest
import request from 'supertest'

// App
import { app } from '../../app'

// Router
import { USER_URL } from '../'

it('Sign out should be return { currentUser: null }', async () => {
	await global.signIn()

	const response = await request(app).post(`${USER_URL}/sign-out`)

	expect(response.get('Set-Cookie')[0]).toEqual(
		'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
	)
})
