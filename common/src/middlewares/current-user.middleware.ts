// Express
import { Request, Response, NextFunction } from 'express'

// JWT
import jwt from 'jsonwebtoken'

interface IUserPayload {
	id: string
	email: string
}

declare global {
	namespace Express {
		interface Request {
			currentUser?: IUserPayload
		}
	}
}

const currentUserMiddleware_me = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// Check if there's no JWT in cookie
	if (!req.session?.jwt) {
		return next()
	}

	try {
		const user = (await jwt.verify(
			req.session!.jwt,
			process.env.JWT_KEY!
		)) as IUserPayload
		req.currentUser = user
	} finally {
		//
	}

	return next()
}

export { currentUserMiddleware_me }
