// Mongoose
import { Document, Model, Schema, model } from 'mongoose'

// Bcrypt
import bcrypt from 'bcrypt'

interface UserAttrs {
	email: string
	password: string
}

interface UserDocument extends Document {
	email: string
	password: string
}

interface UserModel extends Model<UserDocument> {
	build: (attrs: UserAttrs) => UserDocument
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

userSchema.statics.build = (attrs: UserAttrs) => {
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

const User = model<UserDocument, UserModel>('User', userSchema)

export { User }
