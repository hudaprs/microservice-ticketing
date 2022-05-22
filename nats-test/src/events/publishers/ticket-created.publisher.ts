// Base
import { Publisher } from '../publisher.base'

// Event
import { TicketCreatedEvent } from '../event'

// Subjects
import { Subjects } from '../subjects'

class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	readonly subject = Subjects.TicketCreated
}

export { TicketCreatedPublisher }
