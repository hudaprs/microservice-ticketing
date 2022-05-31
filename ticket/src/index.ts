// App
import { app } from './app'

// Mongoose
import mongoose from 'mongoose'

// NATS Wrapper
import { natsWrapper } from './nats-wrapper'

// Events
import { OrderCreatedListener, OrderCancelledListener } from './events'

const start = async (): Promise<void> => {
	try {
		if (!process.env.NATS_CLUSTER_ID)
			throw new Error('NATS_CLUSTER_ID is not defined!')
		if (!process.env.NATS_CLIENT_ID)
			throw new Error('NATS_CLIENT_ID is not defined!')
		if (!process.env.NATS_URI) throw new Error('NATS_URI is not defined!')
		if (!process.env.JWT_KEY) throw new Error('JWT_KEY is not defined!')
		if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not defined!')

		await natsWrapper.connect(
			process.env.NATS_CLUSTER_ID,
			process.env.NATS_CLIENT_ID,
			process.env.NATS_URI
		)
		console.log('Ticket NATS Connected')
		natsWrapper.client.on('close', () => {
			console.log('NATS Closed!')
			process.exit()
		})
		process.on('SIGINT', () => natsWrapper.client.close())
		process.on('SIGTERM', () => natsWrapper.client.close())

		// Listen incoming event
		new OrderCreatedListener(natsWrapper.client).listen()
		new OrderCancelledListener(natsWrapper.client).listen()

		await mongoose.connect(process.env.MONGO_URI)
		console.log('Ticket MongoDB Connected')

		app.listen(3000, () => console.log('Ticket Service Started'))
	} catch (err) {
		console.error('Something Went Wrong When Starting The Ticket Service', err)
		process.exit()
	}
}

// Start The App
start()
