// Common
import {
	Listener,
	Subjects,
	ExpirationCompleteEvent,
	OrderStatus
} from '@hudaprs-ticketing/common'

// Constants
import { ORDER_SERVICE } from '../../constants'

// NATS
import { Message } from 'node-nats-streaming'

// Models
import { Order } from '../../models'

// Publishers
import { OrderCancelledPublisher } from '../publishers'

class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
	readonly subject = Subjects.ExpirationComplete
	queueGroupName = ORDER_SERVICE

	/**
	 * @description Watch any incoming event
	 *
	 * @param {ExpirationCompleteEvent['data']} data
	 * @param {Message} message
	 *
	 * @return {Promise<void>} Promise<void>
	 */
	async onMessage(
		data: ExpirationCompleteEvent['data'],
		message: Message
	): Promise<void> {
		const order = await Order.findById(data.orderId).populate('ticket')

		if (!order) throw new Error('Order not found')

		// Check if order is already complete
		if (order.status === OrderStatus.Complete) return message.ack()

		order.set({ status: OrderStatus.Cancelled })
		await order.save()

		await new OrderCancelledPublisher(this.client).publish({
			id: order.id,
			version: order.version,
			ticket: {
				id: order.ticket.id
			}
		})

		message.ack()
	}
}

export { ExpirationCompleteListener }
