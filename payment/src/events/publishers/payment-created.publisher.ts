// Common
import {
	Publisher,
	Subjects,
	PaymentCreatedEvent
} from '@hudaprs-ticketing/common'

class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
	readonly subject = Subjects.PaymentCreated
}

export { PaymentCreatedPublisher }
