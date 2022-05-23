// Express
import { Request, Response, Router } from 'express'

// Common
import {
	NotFoundError,
	requireAuthMiddleware_requireAuth,
	UnauthorizedError
} from '@hudaprs-ticketing/common'

// Model
import { Order } from '../models'

const router: Router = Router()

router.get(
	'/:id',
	requireAuthMiddleware_requireAuth,
	async (req: Request, res: Response) => {
		const order = await Order.findById(req.params.id)
		if (!order) throw new NotFoundError('Order not found')

		// Check if order is not the same as user that authenticated
		if (order.userId !== req.currentUser!.id)
			throw new UnauthorizedError('You have no permission to access this order')

		res.status(200).json(order)
	}
)

export { router as singleRouter }
