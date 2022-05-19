// Express
import { Request, Response, Router } from 'express'

// Express Validator
import { body } from 'express-validator'

// Common Modules
import {
	validationMiddleware_validate,
	BadRequestError
} from '@hudaprs-ticketing/common'

// Models
import { User } from '../models'

// Router
const router: Router = Router()

router.post(
	'/sign-up',
	[
		body('email').isEmail().withMessage('Email must be valid'),
		body('password')
			.isLength({ min: 8, max: 20 })
			.withMessage('Password must between 8 and 20 characters')
	],
	validationMiddleware_validate,
	async (req: Request, res: Response) => {
		const { email, password } = req.body

		// Check if email exists
		const user = await User.findOne({ email })
		if (user) throw new BadRequestError('Email already registered')

		const newUser = User.build({ email, password })
		await newUser.save()

		return res.status(201).json(newUser)
	}
)

const signUpRouter = router

export { signUpRouter }
