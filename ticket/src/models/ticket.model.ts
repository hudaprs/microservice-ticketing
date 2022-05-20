// Mongoose
import { Schema, Model, Document, model } from 'mongoose'

interface ITicketAttrs {
	title: string
	price: number
	userId: string
}

interface ITicketDocument extends Document {
	title: string
	price: number
	userId: string
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
		},
		userId: {
			type: String,
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

const Ticket = model<ITicketDocument, ITicketModel>('Ticket', ticketSchema)

export { Ticket }
