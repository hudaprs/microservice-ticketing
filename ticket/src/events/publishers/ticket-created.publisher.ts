// Common
import {
	Publisher,
	Subjects,
	TicketCreatedEvent
} from '@hudaprs-ticketing/common'

class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	readonly subject = Subjects.TicketCreated
}

export { TicketCreatedPublisher }
