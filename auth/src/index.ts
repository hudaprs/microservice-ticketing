// Mongoose
import mongoose from 'mongoose'

// App
import { app } from './app'

const start = async (): Promise<void> => {
	try {
		if (!process.env.JWT_KEY) throw new Error('JWT_KEY is not defined!')
		if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not defined!')

		await mongoose.connect(process.env.MONGO_URI)
		console.log('Auth MongoDB Connected')

		app.listen(3000, () => console.log('Auth Service Started...'))
	} catch (err) {
		console.error('Something Went Wrong When Starting The Auth Service', err)
		process.exit()
	}
}

// Start The App
start()
