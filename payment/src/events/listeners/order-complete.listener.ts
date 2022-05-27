// Common
import {
	Listener,
	Subjects,
	OrderCompleteEvent,
	OrderStatus
} from '@hudaprs-ticketing/common'

// Constant
import { PAYMENT_SERVICE } from '../../constants'

// Models
import { Order } from '../../models'

// NATS
import { Message } from 'node-nats-streaming'

class OrderCompleteListener extends Listener<OrderCompleteEvent> {
	readonly subject = Subjects.OrderComplete
	queueGroupName = PAYMENT_SERVICE

	/**
	 * @description Watch any incoming event
	 *
	 * @param {OrderCompleteEvent['data']} data
	 * @param {Message} message
	 *
	 * @return {Promise<void>} Promise<void>
	 */
	async onMessage(
		data: OrderCompleteEvent['data'],
		message: Message
	): Promise<void> {
		const order = await Order.findByEvent({
			id: data.id,
			version: data.version
		})

		if (!order) throw new Error('Order Not Found')

		order.set({ status: OrderStatus.Complete })
		await order.save()

		message.ack()
	}
}

export { OrderCompleteListener }
