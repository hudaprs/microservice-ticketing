// Express
import { Request, Response, NextFunction } from 'express'

// Express Validator
import { validationResult } from 'express-validator'

// Error
import { ValidationError } from '../errors'

const validationMiddleware_validate = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) throw new ValidationError(errors.array())

	next()
}

export { validationMiddleware_validate }
