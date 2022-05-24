// Mongoose
import { Schema, Document, Model, model } from 'mongoose'

// Model
import { Order } from './order.model'

// Common
import { OrderStatus } from '@hudaprs-ticketing/common'

// Mongoose Update If Current
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface ITicketAttrs {
	id: string
	title: string
	price: number
}

interface ITicketDocument extends Document {
	title: string
	price: number
	version: number
	isReserved: () => Promise<boolean>
}

interface ITicketModel extends Model<ITicketDocument> {
	build: (attrs: ITicketAttrs) => ITicketDocument
	findByEvent: (attrs: { id: string; version: number }) => ITicketDocument
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

ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.build = (attrs: ITicketAttrs) => {
	return new Ticket({ _id: attrs.id, title: attrs.title, price: attrs.price })
}
ticketSchema.statics.findByEvent = (attrs: { id: string; version: number }) => {
	return Ticket.findOne({ _id: attrs.id, version: attrs.version - 1 })
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
