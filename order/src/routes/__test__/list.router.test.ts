// Supertest
import request from 'supertest'

// App
import { app } from '../../app'

// Models
import { Ticket, TicketDocument } from '../../models'

// Mongoose
import mongoose from 'mongoose'

// Router
import { ORDER_URL } from '../'

const createTicket = async (): Promise<TicketDocument> => {
	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: 'Ticket',
		price: 10
	})
	await ticket.save()

	return ticket
}

it('List should be return 401 if user unauthenticated', () => {
	return request(app).get(`${ORDER_URL}`).expect(401)
})

it('List should be listing orders for current user that logged in', async () => {
	// Create ticket to be reserved
	const ticketOne = await createTicket()
	const ticketTwo = await createTicket()
	const ticketThree = await createTicket()

	// Create some users
	const userOne = global.signIn()
	const userTwo = global.signIn()

	// Create order for user #1
	await request(app)
		.post(`${ORDER_URL}`)
		.send({
			ticketId: ticketOne.id
		})
		.set('Cookie', userOne)
		.expect(201)

	// Create order for user #2
	await request(app)
		.post(`${ORDER_URL}`)
		.send({
			ticketId: ticketTwo.id
		})
		.set('Cookie', userTwo)
		.expect(201)

	// Create order for user #2, again
	await request(app)
		.post(`${ORDER_URL}`)
		.send({
			ticketId: ticketThree.id
		})
		.set('Cookie', userTwo)
		.expect(201)

	// Check if user one have just one reservation
	const { body: orderListOne } = await request(app)
		.get(`${ORDER_URL}`)
		.set('Cookie', userOne)
		.expect(200)
	expect(orderListOne.length).toEqual(1)

	// Check if user two have two reservations
	const { body: orderListTwo } = await request(app)
		.get(`${ORDER_URL}`)
		.set('Cookie', userTwo)
		.expect(200)
	expect(orderListTwo.length).toEqual(2)
})
