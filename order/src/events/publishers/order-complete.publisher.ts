// Common
import {
	OrderCompleteEvent,
	Publisher,
	Subjects
} from '@hudaprs-ticketing/common'

class OrderCompletePublisher extends Publisher<OrderCompleteEvent> {
	readonly subject = Subjects.OrderComplete
}

export { OrderCompletePublisher }
