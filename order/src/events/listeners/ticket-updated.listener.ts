// Common
import {
	Listener,
	Subjects,
	TicketUpdatedEvent
} from '@hudaprs-ticketing/common'

// Constant
import { ORDER_SERVICE } from '../../constants'

// NATS
import { Message } from 'node-nats-streaming'

// Models
import { Ticket } from '../../models'

class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
	readonly subject = Subjects.TicketUpdated
	queueGroupName = ORDER_SERVICE

	/**
	 * @description Watch any incoming data from subject
	 *
	 * @param {TicketUpdatedEvent['data']} data
	 * @param {Message} message
	 *
	 * @return {Promise<void>} Promise<void>
	 */
	async onMessage(
		data: TicketUpdatedEvent['data'],
		message: Message
	): Promise<void> {
		const { id, title, price, version } = data

		const ticket = await Ticket.findByEvent({ id, version })
		if (!ticket) throw new Error('Ticket not found')

		await ticket
			.set({
				title,
				price
			})
			.save()

		message.ack()
	}
}

export { TicketUpdatedListener }
