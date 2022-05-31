// Supertest
import request from 'supertest'

// App
import { app } from '../../app'

// Router
import { ORDER_URL } from '../'

// Models
import { Ticket } from '../../models'

// Mongoose
import mongoose from 'mongoose'

it('Single should be return 404 when order not found', () => {
	return request(app)
		.get(`${ORDER_URL}/asdasasdas`)
		.set('Cookie', global.signIn())
		.expect(404)
})

it('Single should be return 401 when incorrect user trying to access', async () => {
	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: 'Ticket One',
		price: 10
	})
	await ticket.save()

	const { body: order } = await request(app)
		.post(`${ORDER_URL}`)
		.set('Cookie', global.signIn())
		.send({
			ticketId: ticket.id
		})
		.expect(201)

	return request(app)
		.get(`${ORDER_URL}/${order.id}`)
		.set('Cookie', global.signIn())
		.expect(401)
})

it('Single should be accessed with the correct user', async () => {
	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: 'Ticket One',
		price: 10
	})
	await ticket.save()

	const cookie = global.signIn()

	const { body: order } = await request(app)
		.post(`${ORDER_URL}`)
		.set('Cookie', cookie)
		.send({
			ticketId: ticket.id
		})
		.expect(201)

	return request(app)
		.get(`${ORDER_URL}/${order.id}`)
		.set('Cookie', cookie)
		.expect(200)
})
