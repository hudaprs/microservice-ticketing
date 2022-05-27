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

// Models
import { Order, Payment } from '../models'

// Stripe
import { stripe } from '../stripe'

// Events
import { PaymentCreatedPublisher } from '../events'

// NATS
import { natsWrapper } from '../nats-wrapper'

const router: Router = Router()

router.post(
	'/',
	requireAuthMiddleware_requireAuth,
	[
		body('orderId').not().isEmpty().withMessage('Order ID is required'),
		body('token').not().isEmpty().withMessage('Token is required')
	],
	validationMiddleware_validate,
	async (req: Request, res: Response) => {
		const { orderId, token } = req.body

		const order = await Order.findById(orderId)

		// Check if order not found
		if (!order) throw new NotFoundError('Order not found')

		// Check if order is cancelled
		if (order.status === OrderStatus.Cancelled)
			throw new BadRequestError('Cancelled order cannot be processed')

		// Check if order already complete
		if (order.status === OrderStatus.Complete)
			throw new BadRequestError('Complete order cannot be processed again')

		// Check if order not the same as the user that login
		if (order.userId !== req.currentUser!.id)
			throw new BadRequestError('You have no permission to do this action')

		const charge = await stripe.charges.create({
			currency: 'usd',
			amount: order.price * 100,
			source: token
		})
		const payment = Payment.build({ orderId: order.id, stripeId: charge.id })
		await payment.save()

		// Publish
		await new PaymentCreatedPublisher(natsWrapper.client).publish({
			id: payment.id,
			orderId: payment.orderId,
			stripeId: payment.stripeId
		})

		res.status(201).json({ message: 'Payment has been made' })
	}
)

export { router as createRouter }
