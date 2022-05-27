// Express
import { Express } from 'express'

// Common
import { NotFoundError } from '@hudaprs-ticketing/common'

// Routes
import { createRouter } from './create.router'

// Constant
const PAYMENT_URL = '/api/payments'

const routes = (app: Express) => {
	app.use(PAYMENT_URL, createRouter)

	app.all('*', () => {
		throw new NotFoundError()
	})
}

export { routes }
