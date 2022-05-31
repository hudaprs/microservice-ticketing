// Supertest
import request from 'supertest'

// App
import { app } from '../../app'

// Mongoose
import mongoose from 'mongoose'

// Router
import { ORDER_URL } from '..'

// Models
import { TicketDocument, Ticket } from '../../models'

// Common
import { OrderStatus } from '@hudaprs-ticketing/common'

// NATS Wrapper
import { natsWrapper } from '../../nats-wrapper'

const createTicket = async (): Promise<TicketDocument> => {
	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: 'Ticket',
		price: 10
	})
	await ticket.save()

	return ticket
}

it('Delete should be return 401 if user unauthorized', () => {
	return request(app).delete(`${ORDER_URL}/asdasdas`).expect(401)
})

it('Delete should be return 404 if order not found', () => {
	return request(app)
		.delete(`${ORDER_URL}/asdassad`)
		.set('Cookie', global.signIn())
		.expect(404)
})

it('Delete should be return 401 when user want to cancel another user order', async () => {
	// Create a new ticket
	const ticket = await createTicket()

	// Make two users
	const userOne = global.signIn()
	const userTwo = global.signIn()

	// Create an order
	const { body: order } = await request(app)
		.post(`${ORDER_URL}`)
		.send({ ticketId: ticket.id })
		.set('Cookie', userOne)
		.expect(201)

	return request(app)
		.delete(`${ORDER_URL}/${order.id}`)
		.set('Cookie', userTwo)
		.expect(401)
})

it('Delete should be make orderStatus cancelled', async () => {
	const ticket = await createTicket()

	const cookie = global.signIn()

	const { body: order } = await request(app)
		.post(`${ORDER_URL}`)
		.set('Cookie', cookie)
		.send({
			ticketId: ticket.id
		})
		.expect(201)

	const { body: cancelledOrder } = await request(app)
		.delete(`${ORDER_URL}/${order.id}`)
		.set('Cookie', cookie)
		.expect(200)

	expect(cancelledOrder.status).toBe(OrderStatus.Cancelled)
})

it('Delete should be publishing an event', async () => {
	const ticket = await createTicket()

	const cookie = global.signIn()

	const { body: order } = await request(app)
		.post(`${ORDER_URL}`)
		.set('Cookie', cookie)
		.send({
			ticketId: ticket.id
		})
		.expect(201)

	await request(app)
		.delete(`${ORDER_URL}/${order.id}`)
		.set('Cookie', cookie)
		.expect(200)

	expect(natsWrapper.client.publish).toHaveBeenCalled()
})
