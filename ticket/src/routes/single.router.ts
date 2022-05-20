// Express
import { Request, Response, Router } from 'express'

// Model
import { Ticket } from '../models'

// Common
import { NotFoundError } from '@hudaprs-ticketing/common'

const router: Router = Router()

router.get('/:id', async (req: Request, res: Response) => {
	const ticket = await Ticket.findById(req.params.id)

	if (!ticket) throw new NotFoundError('Ticket not found')

	res.status(200).json(ticket)
})

export { router as singleRouter }
