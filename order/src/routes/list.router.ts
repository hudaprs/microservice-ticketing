// Express
import { Request, Response, Router } from 'express'

// Common
import { requireAuthMiddleware_requireAuth } from '@hudaprs-ticketing/common'

// Model
import { Order } from '../models'

const router: Router = Router()

router.get(
	'/',
	requireAuthMiddleware_requireAuth,
	async (req: Request, res: Response) => {
		const orders = await Order.find({ userId: req.currentUser!.id }).populate(
			'ticket'
		)

		res.status(200).json(orders)
	}
)

export { router as listRouter }
