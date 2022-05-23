// Express
import { Request, Response, Router } from 'express'

// Express Validator
import { body } from 'express-validator'

// Common
import {
	BadRequestError,
	NotFoundError,
	OrderStatus,
	requireAuthMiddleware_requireAuth,
	validationMiddleware_validate
} from '@hudaprs-ticketing/common'

// NATS Wrapper
import { natsWrapper } from '../nats-wrapper'

// Mongoose
import mongoose from 'mongoose'

// Models
import { Order, Ticket } from '../models'

const router: Router = Router()

const EXPIRES_TIME = 15 * 60

router.post(
	'/',
	requireAuthMiddleware_requireAuth,
	[
		body('ticketId')
			.not()
			.isEmpty()
			.custom((input: string) => mongoose.Types.ObjectId.isValid(input))
			.withMessage('ticketId is not match')
	],
	validationMiddleware_validate,
	async (req: Request, res: Response) => {
		const { ticketId } = req.body

		// Check if ticket exists
		const ticket = await Ticket.findById(ticketId)
		if (!ticket) throw new NotFoundError('Ticket not found')

		// Check if ticket not already reserved
		const isReserved = await ticket.isReserved()
		if (isReserved) throw new BadRequestError('Ticket already been reserved')

		// Set order expiration time
		const expirationTime = new Date()
		expirationTime.setSeconds(expirationTime.getSeconds() + EXPIRES_TIME)

		// Save order to database
		const order = await Order.build({
			userId: req.currentUser!.id,
			expiresAt: expirationTime,
			status: OrderStatus.Created,
			ticket
		}).save()

		res.status(201).json({ message: 'Create Order Success' })
	}
)

export { router as createRouter }
