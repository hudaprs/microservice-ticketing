// Subjects
import { Subjects } from '../subjects'

interface TicketUpdatedEvent {
	subject: Subjects.TicketUpdated
	data: {
		id: string
		title: string
		price: number
		userId: string
		version: number
		orderId?: string
	}
}

export { TicketUpdatedEvent }
