// Mongoose
import { Document, Model, Schema, model } from 'mongoose'

// Common
import { OrderStatus } from '@hudaprs-ticketing/common'

// Model
import { ITicketDocument } from './ticket.model'

// Mongoose Update If Current
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface IOrderAttrs {
	userId: string
	status: OrderStatus
	expiresAt: Date
	ticket: ITicketDocument
}

interface IOrderDocument extends Document {
	userId: string
	status: OrderStatus
	expiresAt: Date
	ticket: ITicketDocument
	version: number
}

interface IOrderModel extends Model<IOrderDocument> {
	build: (attrs: IOrderAttrs) => IOrderDocument
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

orderSchema.statics.build = (attrs: IOrderAttrs) => {
	return new Order(attrs)
}

const Order = model<IOrderDocument, IOrderModel>('Order', orderSchema)

export { Order }
