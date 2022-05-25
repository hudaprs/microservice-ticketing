// Common
import {
	Listener,
	Subjects,
	OrderCreatedEvent
} from '@hudaprs-ticketing/common'

// Constants
import { EXPIRATION_SERVICE } from '../../constants'

// NATS
import { Message } from 'node-nats-streaming'

// Queue
import { orderExpirationQueue } from '../../queue'

class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	readonly subject = Subjects.OrderCreated
	queueGroupName = EXPIRATION_SERVICE

	/**
	 * @description Watch incoming event
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
		const delay = new Date(data.expiresAt).getTime() - new Date().getTime()

		await orderExpirationQueue.add(
			{
				orderId: data.id
			},
			{ delay }
		)

		message.ack()
	}
}

export { OrderCreatedListener }
