// Supertest
import request from 'supertest'

// App
import { app } from '../../app'

// Router
import { TICKET_URL } from '../'

// NATS Wrapper
import { natsWrapper } from '../../nats-wrapper'

it('Create should be return 201 when success', () => {
	return request(app)
		.post(`${TICKET_URL}/`)
		.send({
			title: 'Ticket Title',
			price: 10
		})
		.set('Cookie', global.signIn())
		.expect(201)
})

it('Create should be return 422 when invalid title', () => {
	return request(app)
		.post(`${TICKET_URL}/`)
		.send({
			title: '',
			price: 10
		})
		.set('Cookie', global.signIn())
		.expect(422)
})

it('Create should be return 422 when invalid price', () => {
	return request(app)
		.post(`${TICKET_URL}/`)
		.send({
			title: 'Ticket Title',
			price: -1
		})
		.set('Cookie', global.signIn())
		.expect(422)
})

it('Create should be return 401 when user unauthenticated', () => {
	return request(app)
		.post(`${TICKET_URL}/`)
		.send({
			title: 'Ticket Title',
			price: -1
		})
		.expect(401)
})

it('Create should be publishing an event', async () => {
	await request(app)
		.post(`${TICKET_URL}/`)
		.send({
			title: 'Ticket Title',
			price: 10
		})
		.set('Cookie', global.signIn())
		.expect(201)

	expect(natsWrapper.client.publish).toHaveBeenCalled()
})
