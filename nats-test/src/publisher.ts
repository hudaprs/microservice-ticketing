// NATS
import nats from 'node-nats-streaming'

console.clear()

const stan = nats.connect('ticketing', 'abc', {
	url: 'http://localhost:4222'
})

stan.on('connect', () => {
	console.log('Publisher connected to NATS')

	const ticket = JSON.stringify({
		id: '123',
		title: 'Ticket One',
		price: 1.25
	})

	stan.publish('ticket:created', ticket, () => {
		console.log('ticket:created published!')
	})
})
