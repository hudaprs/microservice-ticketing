// Express
import { Request, Response, NextFunction } from 'express'

// Error
import { UnauthorizedError } from '../errors'

const requireAuthMiddleware_requireAuth = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.currentUser) {
		throw new UnauthorizedError()
	}

	next()
}

export { requireAuthMiddleware_requireAuth }
