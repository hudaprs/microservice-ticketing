// Mongoose
import { Schema, Document, Model, model } from 'mongoose'

// Common
import { OrderStatus } from '@hudaprs-ticketing/common'

// Mongoose Update If Current
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface OrderAttrs {
	id: string
	status: OrderStatus
	version: number
	userId: string
	price: number
}

interface OrderDocument extends Document {
	status: OrderStatus
	version: number
	userId: string
	price: number
}

interface OrderModel extends Model<OrderDocument> {
	build: (attrs: OrderAttrs) => OrderDocument
	findByEvent: (attrs: { id: string; version: number }) => OrderDocument
}

const orderSchema = new Schema(
	{
		status: {
			type: String,
			enum: Object.values(OrderStatus),
			default: OrderStatus.Created,
			required: true
		},
		userId: {
			type: String,
			required: true
		},
		price: {
			type: Number,
			required: true
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
	return new Order({
		_id: attrs.id,
		status: attrs.status,
		userId: attrs.userId,
		price: attrs.price,
		version: attrs.version
	})
}
orderSchema.statics.findByEvent = (attrs: { id: string; version: number }) => {
	return Order.findOne({ _id: attrs.id, version: attrs.version - 1 })
}

const Order = model<OrderDocument, OrderModel>('Order', orderSchema)

export { Order }
