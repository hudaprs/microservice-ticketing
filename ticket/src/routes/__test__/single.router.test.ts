// Supertest
import request from 'supertest'

// App
import { app } from '../../app'

// Router
import { TICKET_URL } from '../'

it('Single should be return 404 when ticket not found', () => {
	return request(app).get(`${TICKET_URL}/asdasdasdsa`).expect(404)
})

it('Single should be return 200 when ticket found', async () => {
	const title = 'Ticket Title'
	const price = 10

	const createdTicketResponse = await request(app)
		.post(`${TICKET_URL}/`)
		.set('Cookie', global.signIn())
		.send({
			title,
			price
		})
		.expect(201)

	const ticketResponse = await request(app)
		.get(`${TICKET_URL}/${createdTicketResponse.body.id}`)
		.expect(200)

	expect(ticketResponse.body.title).toBe(title)
	expect(ticketResponse.body.price).toBe(price)
})
