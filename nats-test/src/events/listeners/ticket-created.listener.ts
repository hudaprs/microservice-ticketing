// Base
import { Listener } from '../listener.base'

// NATS
import { Message } from 'node-nats-streaming'

// Event
import { TicketCreatedEvent } from '../event'

// Subjects
import { Subjects } from '../subjects'

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
	readonly subject = Subjects.TicketCreated
	queueGroupName: string = 'payment-service'

	onMessage(data: TicketCreatedEvent['data'], message: Message): void {
		console.log('Event data', data)

		message.ack()
	}
}

export { TicketCreatedListener }
