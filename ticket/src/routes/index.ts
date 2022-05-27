// Express
import { Express } from 'express'

// Common
import { NotFoundError } from '@hudaprs-ticketing/common'

// Routes
import { listRouter } from './list.router'
import { singleRouter } from './single.router'
import { createRouter } from './create.router'
import { updateRouter } from './update.router'

// Constant
const TICKET_URL = '/api/tickets'

const routes = (app: Express) => {
	app.use(TICKET_URL, listRouter)
	app.use(TICKET_URL, singleRouter)
	app.use(TICKET_URL, createRouter)
	app.use(TICKET_URL, updateRouter)

	app.all('*', () => {
		throw new NotFoundError()
	})
}

export { routes }
