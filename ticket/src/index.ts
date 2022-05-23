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
		if (!process.env.JWT_KEY) throw new Error('JWT_KEY is not defined!')
		if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not defined!')

		await natsWrapper.connect(
			'ticketing',
			'SOME_CLIENT_ID',
			'http://nats-srv:4222'
		)
		console.log('Ticket NATS Connected')
		natsWrapper.client.on('close', () => {
			console.log('STAN Closed!')
			process.exit()
		})
		process.on('SIGINT', () => natsWrapper.client.close())
		process.on('SIGTERM', () => natsWrapper.client.close())

		await mongoose.connect(process.env.MONGO_URI)
		console.log('Ticket MongoDB Connected')
	} catch (err) {
		console.error('Something Went Wrong When Starting The Ticket Service', err)
	}

	app.listen(3000, () => console.log('Ticket Service Started'))
}

// Start The App
start()
