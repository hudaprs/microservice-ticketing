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

// Cookie Session
import cookieSession from 'cookie-session'

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

export { app }
