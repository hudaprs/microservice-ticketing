// Subjects
import { Subjects } from '../subjects'

// Types
import { OrderStatus } from '../../types'

interface OrderCreatedEvent {
	subject: Subjects.OrderCreated
	data: {
		userId: string
		status: OrderStatus
		expiresAt: string
		ticket: {
			id: string
			price: number
		}
	}
}

export { OrderCreatedEvent }
