// Common
import {
	Listener,
	Subjects,
	TicketCreatedEvent
} from '@hudaprs-ticketing/common'

// Constant
import { ORDER_SERVICE } from '../../constants'

// NATS
import { Message } from 'node-nats-streaming'

// Models
import { Ticket } from '../../models'

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
	readonly subject = Subjects.TicketCreated
	queueGroupName = ORDER_SERVICE

	/**
	 * @description Watch any incoming data from subject
	 *
	 * @param {TicketCreatedEvent['data']} data
	 * @param {Message} message
	 *
	 * @return {Promise<void>} Promise<void>
	 */
	async onMessage(
		data: TicketCreatedEvent['data'],
		message: Message
	): Promise<void> {
		const { id, title, price } = data

		await Ticket.build({
			id,
			title,
			price
		}).save()

		message.ack()
	}
}

export { TicketCreatedListener }
