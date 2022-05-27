// Mongoose
import { Document, Model, Schema, model } from 'mongoose'

interface PaymentAttrs {
	orderId: string
	stripeId: string
}

interface PaymentDocument extends Document {
	orderId: string
	stripeId: string
}

interface PaymentModel extends Model<PaymentDocument> {
	build: (attrs: PaymentAttrs) => PaymentDocument
}

const paymentSchema = new Schema(
	{
		orderId: {
			type: String,
			required: true
		},
		stripeId: {
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

paymentSchema.set('versionKey', 'version')

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
	return new Payment(attrs)
}

const Payment = model<PaymentDocument, PaymentModel>('Payment', paymentSchema)

export { Payment }
