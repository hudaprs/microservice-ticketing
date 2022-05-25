// Common
import {
	Publisher,
	Subjects,
	ExpirationCompleteEvent
} from '@hudaprs-ticketing/common'

class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
	readonly subject = Subjects.ExpirationComplete
}

export { ExpirationCompletePublisher }
