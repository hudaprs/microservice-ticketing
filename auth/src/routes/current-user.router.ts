// Express
import { Request, Response, Router } from 'express'

// Middleware
import { requireAuthMiddleware_requireAuth } from '../middlewares'

// Router
const router: Router = Router()

router.get(
	'/current-user',
	requireAuthMiddleware_requireAuth,
	(req: Request, res: Response) => {
		return res.status(200).json(req.currentUser)
	}
)

const currentUserRouter = router

export { currentUserRouter }
