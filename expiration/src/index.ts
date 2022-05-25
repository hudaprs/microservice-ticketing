// NATS Wrapper
import { natsWrapper } from './nats-wrapper'

// Events
import { OrderCreatedListener } from './events'

const start = async (): Promise<void> => {
	try {
		if (!process.env.NATS_CLUSTER_ID)
			throw new Error('NATS_CLUSTER_ID is not defined!')
		if (!process.env.NATS_CLIENT_ID)
			throw new Error('NATS_CLIENT_ID is not defined!')
		if (!process.env.NATS_URI) throw new Error('NATS_URI is not defined!')

		await natsWrapper.connect(
			process.env.NATS_CLUSTER_ID,
			process.env.NATS_CLIENT_ID,
			process.env.NATS_URI
		)
		console.log('Expiration NATS Connected')
		natsWrapper.client.on('close', () => {
			console.log('NATS Closed!')
			process.exit()
		})
		process.on('SIGINT', () => natsWrapper.client.close())
		process.on('SIGTERM', () => natsWrapper.client.close())

		// Listen incoming event
		new OrderCreatedListener(natsWrapper.client).listen()
	} catch (err) {
		console.error(
			'Something Went Wrong When Starting The Expiration Service',
			err
		)
	}
}

// Start The App
start()
