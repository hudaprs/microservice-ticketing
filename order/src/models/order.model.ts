// Mongoose
import { Document, Model, Schema, model } from 'mongoose'

// Common
import { OrderStatus } from '@hudaprs-ticketing/common'

// Model
import { TicketDocument } from './ticket.model'

// Mongoose Update If Current
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface OrderAttrs {
	userId: string
	status: OrderStatus
	expiresAt: Date
	ticket: TicketDocument
}

interface OrderDocument extends Document {
	userId: string
	status: OrderStatus
	expiresAt: Date
	ticket: TicketDocument
	version: number
}

interface OrderModel extends Model<OrderDocument> {
	build: (attrs: OrderAttrs) => OrderDocument
}

const orderSchema = new Schema(
	{
		userId: {
			type: String,
			required: true
		},
		status: {
			type: String,
			required: true,
			enum: Object.values(OrderStatus),
			default: OrderStatus.Created
		},
		expiresAt: {
			type: Schema.Types.Date
		},
		ticket: {
			type: Schema.Types.ObjectId,
			ref: 'Ticket'
		}
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id
				delete ret._id
				delete ret.__v
			}
		}
	}
)

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (attrs: OrderAttrs) => {
	return new Order(attrs)
}

const Order = model<OrderDocument, OrderModel>('Order', orderSchema)

export { Order }
