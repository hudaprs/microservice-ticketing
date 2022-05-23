// Common
import {
	Publisher,
	Subjects,
	TicketUpdatedEvent
} from '@hudaprs-ticketing/common'

class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	readonly subject = Subjects.TicketUpdated
}

export { TicketUpdatedPublisher }
