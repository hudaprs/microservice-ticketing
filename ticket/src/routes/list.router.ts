// Express
import { Request, Response, Router } from 'express'

// Model
import { Ticket } from '../models'

const router: Router = Router()

router.get('/', async (req: Request, res: Response) => {
	const tickets = await Ticket.find({})

	res.status(200).json(tickets)
})

export { router as listRouter }
