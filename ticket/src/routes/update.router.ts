// Express
import { Request, Response, Router } from 'express'

// Model
import { Ticket } from '../models'

// Common
import {
	BadRequestError,
	NotFoundError,
	requireAuthMiddleware_requireAuth,
	validationMiddleware_validate
} from '@hudaprs-ticketing/common'

// Express Validator
import { body } from 'express-validator'

const router: Router = Router()

router.put(
	'/:id',
	requireAuthMiddleware_requireAuth,
	[
		body('title').not().isEmpty().withMessage('Title is required'),
		body('price').isFloat({ gt: 0 }).withMessage('Minimum price should be $1')
	],
	validationMiddleware_validate,
	async (req: Request, res: Response) => {
		const { title, price } = req.body

		const ticket = await Ticket.findById(req.params.id)
		if (!ticket) throw new NotFoundError('Ticket not found')

		// Check if ticket is edited by correct user
		if (ticket.userId !== req.currentUser!.id)
			throw new BadRequestError('You not permitted to do this action!')

		ticket.set({
			title,
			price,
			userId: req.currentUser!.id
		})
		await ticket.save()

		res.status(200).json(ticket)
	}
)

export { router as updateRouter }
