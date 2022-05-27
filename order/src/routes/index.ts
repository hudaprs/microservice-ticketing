// Express
import { Express } from 'express'

// Common
import { NotFoundError } from '@hudaprs-ticketing/common'

// Routes
import { listRouter } from './list.router'
import { singleRouter } from './single.router'
import { createRouter } from './create.router'
import { deleteRouter } from './delete.router'

// Constant
const ORDER_URL = '/api/orders'

const routes = (app: Express) => {
	app.use(ORDER_URL, listRouter)
	app.use(ORDER_URL, singleRouter)
	app.use(ORDER_URL, createRouter)
	app.use(ORDER_URL, deleteRouter)

	app.all('*', () => {
		throw new NotFoundError()
	})
}

export { routes }
