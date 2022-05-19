// Express
import { NextFunction, Request, Response } from 'express'

// Error
import { BaseError } from '../errors'

const errorMiddleware_handler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err instanceof BaseError) {
		return res.status(err.statusCode).json({ errors: err.serializeErrors() })
	}

	console.error(err)
	res.status(500).json({ errors: [{ message: 'Something went wrong' }] })
}

export { errorMiddleware_handler }
