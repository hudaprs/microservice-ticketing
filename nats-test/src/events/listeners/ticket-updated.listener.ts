// Base
import { Listener } from '../listener.base'

// Event
import { TicketUpdatedEvent } from '../event/ticket-update.event'

// Subjects
import { Subjects } from '../subjects'

// NATS
import { Message } from 'node-nats-streaming'

class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
	readonly subject = Subjects.TicketUpdated
	queueGroupName = 'payment-service'

	onMessage(data: TicketUpdatedEvent['data'], message: Message) {
		console.log('Event data', data)

		message.ack()
	}
}

export { TicketUpdatedListener }
