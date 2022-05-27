// Express
import express, { Express } from 'express'

// Generate Express Async Error
import 'express-async-errors'

// Routes
import { routes } from './routes'

// Middlewares
import {
	currentUserMiddleware_me,
	errorMiddleware_handler
} from '@hudaprs-ticketing/common'

// Mongoose
import mongoose from 'mongoose'

// Cookie Session
import cookieSession from 'cookie-session'

// NATS Wrapper
import { natsWrapper } from './nats-wrapper'

// Events
import {
	OrderCreatedListener,
	OrderCancelledListener,
	OrderCompleteListener
} from './events'

const app: Express = express()

// Trust Proxy
app.set('trust proxy', true)

// Accept JSON from incoming request
app.use(express.json())

// Enable Cookie Session
app.use(
	cookieSession({
		secure: true,
		signed: false
	})
)

// Init the current user
app.use(currentUserMiddleware_me)

// Init Routes
routes(app)

// Catch any error inside app
app.use(errorMiddleware_handler)

const start = async (): Promise<void> => {
	try {
		if (!process.env.NATS_CLUSTER_ID)
			throw new Error('NATS_CLUSTER_ID is not defined!')
		if (!process.env.NATS_CLIENT_ID)
			throw new Error('NATS_CLIENT_ID is not defined!')
		if (!process.env.NATS_URI) throw new Error('NATS_URI is not defined!')
		if (!process.env.JWT_KEY) throw new Error('JWT_KEY is not defined!')
		if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not defined!')
		if (!process.env.STRIPE_SECRET)
			throw new Error('STRIPE_SECRET is not defined!')

		await natsWrapper.connect(
			process.env.NATS_CLUSTER_ID,
			process.env.NATS_CLIENT_ID,
			process.env.NATS_URI
		)
		console.log('Payment NATS Connected')
		natsWrapper.client.on('close', () => {
			console.log('NATS Closed!')
			process.exit()
		})
		process.on('SIGINT', () => natsWrapper.client.close())
		process.on('SIGTERM', () => natsWrapper.client.close())

		// Listen incoming event
		new OrderCreatedListener(natsWrapper.client).listen()
		new OrderCancelledListener(natsWrapper.client).listen()
		new OrderCompleteListener(natsWrapper.client).listen()

		await mongoose.connect(process.env.MONGO_URI)
		console.log('Payment MongoDB Connected')

		app.listen(3000, () => console.log('Payment Service Started'))
	} catch (err) {
		console.error('Something Went Wrong When Starting The Payment Service', err)
		process.exit()
	}
}

// Start The App
start()
