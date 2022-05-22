// NATS
import nats from 'node-nats-streaming'

// Publishers
import { TicketCreatedPublisher } from './events'

console.clear()

const stan = nats.connect('ticketing', 'abc', {
	url: 'http://localhost:4222'
})

stan.on('connect', async () => {
	console.log('Publisher connected to NATS')

	try {
		await new TicketCreatedPublisher(stan).publish({
			id: '123',
			title: 'Ticket One',
			price: 1.25
		})
	} catch (err) {
		console.error('Something Went Wrong Inside Publisher', err)
	}
})
