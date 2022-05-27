// Common
import {
	Listener,
	Subjects,
	OrderCreatedEvent
} from '@hudaprs-ticketing/common'

// Constant
import { PAYMENT_SERVICE } from '../../constants'

// Models
import { Order } from '../../models'

// NATS
import { Message } from 'node-nats-streaming'

class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	readonly subject = Subjects.OrderCreated
	queueGroupName = PAYMENT_SERVICE

	/**
	 * @description Watch any incoming event
	 *
	 * @param {OrderCreatedEvent['data']} data
	 * @param {Message} message
	 *
	 * @return {Promise<void>} Promise<void>
	 */
	async onMessage(
		data: OrderCreatedEvent['data'],
		message: Message
	): Promise<void> {
		await Order.build({
			id: data.id,
			price: data.ticket.price,
			status: data.status,
			version: data.version,
			userId: data.userId
		}).save()

		message.ack()
	}
}

export { OrderCreatedListener }
