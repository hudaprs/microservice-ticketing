// Common
import {
	Listener,
	Subjects,
	OrderCreatedEvent
} from '@hudaprs-ticketing/common'

// Constants
import { TICKET_SERVICE } from '../../constants'

// NATS
import { Message } from 'node-nats-streaming'

// Models
import { Ticket } from '../../models'

// Events
import { TicketUpdatedPublisher } from '../publishers'

class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	readonly subject = Subjects.OrderCreated
	queueGroupName = TICKET_SERVICE

	/**
	 * @description Watch any incoming evnet
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
		const ticket = await Ticket.findById(data.ticket.id)

		if (!ticket) throw new Error('Ticket not found')

		ticket.set({ orderId: data.id })
		await ticket.save()

		await new TicketUpdatedPublisher(this.client).publish({
			id: ticket.id,
			title: ticket.title,
			price: ticket.price,
			userId: ticket.userId,
			version: ticket.version,
			orderId: ticket.orderId
		})

		message.ack()
	}
}

export { OrderCreatedListener }
