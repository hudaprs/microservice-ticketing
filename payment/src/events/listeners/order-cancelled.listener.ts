// Common
import {
	Listener,
	Subjects,
	OrderCancelledEvent,
	OrderStatus
} from '@hudaprs-ticketing/common'

// Constant
import { PAYMENT_SERVICE } from '../../constants'

// Models
import { Order } from '../../models'

// NATS
import { Message } from 'node-nats-streaming'

class OrderCancelledListener extends Listener<OrderCancelledEvent> {
	readonly subject = Subjects.OrderCancelled
	queueGroupName = PAYMENT_SERVICE

	/**
	 * @description Watch any incoming event
	 *
	 * @param {OrderCancelledEvent['data']} data
	 * @param {Message} message
	 *
	 * @return {Promise<void>} Promise<void>
	 */
	async onMessage(
		data: OrderCancelledEvent['data'],
		message: Message
	): Promise<void> {
		const order = await Order.findByEvent({
			id: data.id,
			version: data.version
		})

		if (!order) throw new Error('Order Not Found')

		order.set({ status: OrderStatus.Cancelled })
		await order.save()

		message.ack()
	}
}

export { OrderCancelledListener }
