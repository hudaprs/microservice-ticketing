// Common
import {
	OrderCreatedEvent,
	Publisher,
	Subjects
} from '@hudaprs-ticketing/common'

class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
	readonly subject = Subjects.OrderCreated
}

export { OrderCreatedPublisher }
