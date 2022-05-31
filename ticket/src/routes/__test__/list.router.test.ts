// Supertest
import request from 'supertest'

// App
import { app } from '../../app'

// Router
import { TICKET_URL } from '../'

it('List should be return 404 when /api/tickets not found', () => {
	return request(app).get(`/api/ticket`).send({}).expect(404)
})

it('List should be return 200 when /api/tickets success return some response', () => {
	return request(app).get(`${TICKET_URL}/`).send({}).expect(200)
})
