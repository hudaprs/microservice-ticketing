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

// Cookie
import cookieSession from 'cookie-session'

// Mongoose
import mongoose from 'mongoose'

const app: Express = express()

// Trust proxy
app.set('trust proxy', true)

// Accept JSON from incoming request
app.use(express.json())

// Enable cookie session
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

		await mongoose.connect(process.env.MONGO_URI)
		console.log('Auth MongoDB Connected')
	} catch (err) {
		console.error('Something Went Wrong When Starting The Auth Service', err)
	}

	app.listen(3000, () => console.log('Auth Service Started'))
}

// Start The App
start()
