// Express
import { Request, Response, Router } from 'express'

// Express Validator
import { body } from 'express-validator'

// Common
import {
	requireAuthMiddleware_requireAuth,
	validationMiddleware_validate
} from '@hudaprs-ticketing/common'

// Model
import { Ticket } from '../models'

// Events
import { TicketCreatedPublisher } from '../events'

// NATS Wrapper
import { natsWrapper } from '../nats-wrapper'

const router: Router = Router()

router.post(
	'/',
	requireAuthMiddleware_requireAuth,
	[
		body('title').not().isEmpty().withMessage('Title is required'),
		body('price').isFloat({ gt: 0 }).withMessage('Minimum price should be $1')
	],
	validationMiddleware_validate,
	async (req: Request, res: Response) => {
		const { title, price } = req.body

		const ticket = await Ticket.build({
			title,
			price,
			userId: req.currentUser!.id
		}).save()
		await new TicketCreatedPublisher(natsWrapper.client).publish({
			id: ticket.id,
			title: ticket.title,
			price: ticket.price,
			userId: ticket.userId,
			version: ticket.version
		})

		res.status(201).json(ticket)
	}
)

export { router as createRouter }
