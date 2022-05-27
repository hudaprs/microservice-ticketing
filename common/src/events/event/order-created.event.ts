// Subjects
import { Subjects } from '../subjects'

// Types
import { OrderStatus } from '../../types'

interface OrderCreatedEvent {
	subject: Subjects.OrderCreated
	data: {
		id: string
		userId: string
		status: OrderStatus
		expiresAt: string
		version: number
		ticket: {
			id: string
			price: number
		}
	}
}

export { OrderCreatedEvent }
