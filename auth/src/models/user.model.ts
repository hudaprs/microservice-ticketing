// Mongoose
import { Document, Model, Schema, model } from 'mongoose'

// Bcrypt
import bcrypt from 'bcrypt'

interface IUserAttrs {
	email: string
	password: string
}

interface IUserDocument extends Document {
	email: string
	password: string
}

interface IUserModel extends Model<IUserDocument> {
	build: (attrs: IUserAttrs) => IUserDocument
}

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		}
	},
	{
		toJSON: {
			transform: (doc, ret) => {
				ret.id = ret._id
				delete ret.password
				delete ret.__v
				delete ret._id
			}
		}
	}
)

userSchema.statics.build = (attrs: IUserAttrs) => {
	return new User(attrs)
}

userSchema.pre('save', async function (done) {
	if (this.isModified('password')) {
		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(this.get('password'), salt)
		this.set('password', hash)
	}

	done()
})

const User = model<IUserDocument, IUserModel>('User', userSchema)

export { User }
