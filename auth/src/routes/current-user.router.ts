// Express
import { Request, Response, Router } from 'express'

// Common Modules
import { requireAuthMiddleware_requireAuth } from '@hudaprs-ticketing/common'

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
