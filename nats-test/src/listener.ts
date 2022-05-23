// NATS
import nats, { Message, Stan, SubscriptionOptions } from 'node-nats-streaming'

// Crypto
import { randomBytes } from 'crypto'

// Listener
import { TicketCreatedListener, TicketUpdatedListener } from './events'

console.clear()

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
	url: 'http://localhost:4222'
})

stan.on('connect', () => {
	console.log('Listener connected to NATS')

	// Watch incoming ticket service
	new TicketCreatedListener(stan).listen()
	new TicketUpdatedListener(stan).listen()

	// Handle when listener is closed
	stan.on('close', () => {
		console.log('STAN Closed!')
		process.exit()
	})
})

process.on('SIGINT', () => stan.close())
process.on('SIGTERM', () => stan.close())
