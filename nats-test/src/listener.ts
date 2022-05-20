// NATS
import nats, { Message } from 'node-nats-streaming'

// Crypto
import { randomBytes } from 'crypto'

console.clear()

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
	url: 'http://localhost:4222'
})

stan.on('connect', () => {
	console.log('Listener connected to NATS')

	const options = stan
		.subscriptionOptions()
		.setManualAckMode(true)
		.setDeliverAllAvailable()
		.setDurableName('accounting-service')
	const subscription = stan.subscribe(
		'ticket:created',
		'orders-service-queue-group',
		options
	)

	subscription.on('message', (message: Message) => {
		const data = message.getData()

		if (typeof data === 'string') {
			console.log(
				`Recieved event #${message.getSequence()}, with data: ${data}`
			)
		}

		message.ack()
	})

	// Handle when listener is closed
	stan.on('close', () => {
		console.log('STAN Closed!')
		process.exit()
	})
})

process.on('SIGINT', () => stan.close())
process.on('SIGTERM', () => stan.close())
