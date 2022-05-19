// Express
import { Request, Response, Router } from 'express'

// Router
const router: Router = Router()

router.post('/sign-out', (req: Request, res: Response) => {
	// Reset the session
	req.session = null

	return res.status(200).json({ message: 'Sign out success' })
})

const signOutRouter = router

export { signOutRouter }
