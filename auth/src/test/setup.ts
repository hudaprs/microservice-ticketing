// Mongodb Memory Server
import { MongoMemoryServer } from 'mongodb-memory-server'

// Mongoose
import mongoose from 'mongoose'

// App
import { app } from '../app'

// Supertest
import request from 'supertest'

// Router
import { USER_URL } from '../routes'

declare global {
	var signIn: () => Promise<string[]>
}

let mongo: any

// Set timeout of Jest
jest.setTimeout(60000)

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

global.signIn = async (): Promise<string[]> => {
	await request(app)
		.post(`${USER_URL}/sign-up`)
		.send({
			email: 'test@gmail.com',
			password: 'password'
		})
		.expect(201)

	const response = await request(app)
		.post(`${USER_URL}/sign-in`)
		.send({
			email: 'test@gmail.com',
			password: 'password'
		})
		.expect(200)

	return response.get('Set-Cookie')
}
