// Subjects
import { Subjects } from '../subjects'

// Types
import { OrderStatus } from '../../types'

interface OrderCompleteEvent {
	subject: Subjects.OrderComplete
	data: {
		id: string
		status: OrderStatus
		version: number
	}
}

export { OrderCompleteEvent }
