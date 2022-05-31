// Supertest
import request from 'supertest'

// App
import { app } from '../../app'

// Mongoose
import mongoose from 'mongoose'

// Router
import { ORDER_URL } from '../'

// Models
import { Ticket } from '../../models'

// NATS Wrapper
import { natsWrapper } from '../../nats-wrapper'

const createTicket = async () => {
	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: 'Ticket',
		price: 10
	})
	await ticket.save()

	return ticket
}

it('Create should be return 401 if user unauthenticated', () => {
	return request(app).post(`${ORDER_URL}`).expect(401)
})

it('Create should be return 404 if ticketId payload not valid', () => {
	return request(app)
		.post(`${ORDER_URL}`)
		.send({ ticketId: 'asdasdjasldj' })
		.set('Cookie', global.signIn())
		.expect(404)
})

it('Create should be return 404 when ticket not found', async () => {
	return request(app)
		.post(`${ORDER_URL}`)
		.send({ ticketId: new mongoose.Types.ObjectId().toHexString() })
		.set('Cookie', global.signIn())
		.expect(404)
})

it('Create should be not able to create reserved ticket', async () => {
	const ticket = await createTicket()

	await request(app)
		.post(`${ORDER_URL}`)
		.set('Cookie', global.signIn())
		.send({
			ticketId: ticket.id
		})
		.expect(201)

	await request(app)
		.post(`${ORDER_URL}`)
		.set('Cookie', global.signIn())
		.send({
			ticketId: ticket.id
		})
		.expect(400)
})

it('Create should be return 201 if success', async () => {
	const ticket = await createTicket()

	await request(app)
		.post(`${ORDER_URL}`)
		.set('Cookie', global.signIn())
		.send({
			ticketId: ticket.id
		})
		.expect(201)
})

it('Create should be publishing an event', async () => {
	const ticket = await createTicket()

	await request(app)
		.post(`${ORDER_URL}`)
		.send({
			ticketId: ticket.id
		})
		.set('Cookie', global.signIn())
		.expect(201)

	expect(natsWrapper.client.publish).toHaveBeenCalled()
})
