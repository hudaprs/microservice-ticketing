// Mongoose
import { Schema, Document, Model, model } from 'mongoose'

// Model
import { Order } from './order.model'

// Common
import { OrderStatus } from '@hudaprs-ticketing/common'

interface ITicketAttrs {
	title: string
	price: number
}

interface ITicketDocument extends Document {
	title: string
	price: number
	isReserved: () => Promise<boolean>
}

interface ITicketModel extends Model<ITicketDocument> {
	build: (attrs: ITicketAttrs) => ITicketDocument
}

const ticketSchema = new Schema(
	{
		title: {
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

ticketSchema.statics.build = (attrs: ITicketAttrs) => {
	return new Ticket(attrs)
}

ticketSchema.methods.isReserved = async function () {
	const existingOrder = await Order.findOne({
		ticket: this,
		status: {
			$in: [
				OrderStatus.Created,
				OrderStatus.AwaitingPayment,
				OrderStatus.Complete
			]
		}
	})

	return !!existingOrder
}

const Ticket = model<ITicketDocument, ITicketModel>('Ticket', ticketSchema)

export { Ticket, ITicketDocument }
