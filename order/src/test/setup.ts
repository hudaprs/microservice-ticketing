// Mongodb Memory Server
import { MongoMemoryServer } from 'mongodb-memory-server'

// Mongoose
import mongoose from 'mongoose'

// JWT
import jwt from 'jsonwebtoken'

declare global {
	var signIn: () => string[]
}

let mongo: any

// Set timeout of Jest
jest.setTimeout(60000)

// Mocks
jest.mock('../nats-wrapper')

beforeAll(async () => {
	// Set ENV for JWT
	process.env.JWT_KEY = 'asdf'

	mongo = await MongoMemoryServer.create()
	const mongoUri = await mongo.getUri()

	await mongoose.connect(mongoUri)
})

beforeEach(async () => {
	const collections = await mongoose.connection.db.collections()

	for (const collection of collections) {
		collection.deleteMany({})
	}
})

afterAll(async () => {
	await mongo.stop()
	await mongoose.connection.close()
})

global.signIn = (): string[] => {
	// Payload
	const payload = {
		id: new mongoose.Types.ObjectId().toHexString(),
		email: 'test@gmail.com'
	}

	// Generate JWT
	const token = jwt.sign(payload, process.env.JWT_KEY!)

	// Create a payload for JWT
	const session = { jwt: token }

	// Make session to string
	const sessionStringify = JSON.stringify(session)

	// Generate Base64
	const base64 = Buffer.from(sessionStringify).toString('base64')

	return [`session=${base64}`]
}
