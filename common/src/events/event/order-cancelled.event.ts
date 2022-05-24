// Subjects
import { Subjects } from '../subjects'

interface OrderCancelledEvent {
	subject: Subjects.OrderCancelled
	data: {
		id: string
		ticket: {
			id: string
		}
	}
}

export { OrderCancelledEvent }
