// Express
import { NextFunction, Request, Response } from 'express'

// Error
import { BadRequestError, BaseError } from '../errors'

// Mongoose
import { Error as MongooseError } from 'mongoose'

const errorMiddleware_handler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// Common Error
	if (err instanceof BaseError) {
		return res.status(err.statusCode).json({ errors: err.serializeErrors() })
	}

	// Mongoose Error
	if (err instanceof MongooseError.CastError && err.kind === 'ObjectId') {
		throw new BadRequestError('Invalid ObjectId in parameter!')
	}

	console.error(err)
	res.status(500).json({ errors: [{ message: 'Something went wrong' }] })
}

export { errorMiddleware_handler }
