// Supertest
import request from 'supertest'

// App
import { app } from '../../app'

// Router
import { TICKET_URL } from '../'

// NATS Wrapper
import { natsWrapper } from '../../nats-wrapper'

const createTicket = (cookie?: string[]) =>
	request(app)
		.post(`${TICKET_URL}`)
		.send({ title: 'Ticket Title', price: 10 })
		.set('Cookie', cookie || global.signIn())
		.expect(201)

it('Update should be return 200 when success', async () => {
	const title = 'Updated Ticket'
	const price = 66

	const cookie = global.signIn()

	const newTicket = await request(app)
		.post(`${TICKET_URL}`)
		.send({ title: 'Ticket Title', price: 10 })
		.set('Cookie', cookie)
		.expect(201)

	const response = await request(app)
		.put(`${TICKET_URL}/${newTicket.body.id}`)
		.send({
			title,
			price
		})
		.set('Cookie', cookie)
		.expect(200)

	expect(response.body.title).toBe(title)
	expect(response.body.price).toBe(price)
})

it('Update should be return 422 when invalid title', async () => {
	const ticket = await createTicket()

	return request(app)
		.put(`${TICKET_URL}/${ticket.body.id}`)
		.send({
			title: '',
			price: 10
		})
		.set('Cookie', global.signIn())
		.expect(422)
})

it('Update should be return 422 when invalid price', async () => {
	const ticket = await createTicket()

	return request(app)
		.put(`${TICKET_URL}/${ticket.body.id}`)
		.send({
			title: 'Ticket Title',
			price: -1
		})
		.set('Cookie', global.signIn())
		.expect(422)
})

it('Update should be return 400 when invalid user want to edit', async () => {
	const ticket = await createTicket()

	return request(app)
		.put(`${TICKET_URL}/${ticket.body.id}`)
		.send({
			title: 'Updated Ticket',
			price: 10
		})
		.set('Cookie', global.signIn())
		.expect(400)
})

it('Update should be return 404 when ticket not found', () => {
	return request(app)
		.put(`${TICKET_URL}/asdsadsdasd`)
		.send({ title: 'Ticket Updated', price: 10 })
		.set('Cookie', global.signIn())
		.expect(404)
})

it('Update should be return 401 when user unauthenticated', async () => {
	const ticket = await createTicket()

	return request(app)
		.put(`${TICKET_URL}/${ticket.body.id}`)
		.send({
			title: 'Ticket Title',
			price: -1
		})
		.expect(401)
})

it('Update should be publishing an event', async () => {
	const title = 'Updated Ticket'
	const price = 66

	const cookie = global.signIn()

	const newTicket = await createTicket(cookie)

	const response = await request(app)
		.put(`${TICKET_URL}/${newTicket.body.id}`)
		.send({
			title,
			price
		})
		.set('Cookie', cookie)
		.expect(200)

	expect(response.body.title).toBe(title)
	expect(response.body.price).toBe(price)
	expect(natsWrapper.client.publish).toHaveBeenCalled()
})
