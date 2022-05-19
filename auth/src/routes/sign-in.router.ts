// Express
import { Request, Response, Router } from 'express'

// Express Validator
import { body } from 'express-validator'

// Common Modules
import {
	validationMiddleware_validate,
	BadRequestError
} from '@hudaprs-ticketing/common'

// Model
import { User } from '../models'

// Bcrypt
import bcrypt from 'bcrypt'

// JWT
import jwt from 'jsonwebtoken'

// Router
const router: Router = Router()

router.post(
	'/sign-in',
	[
		body('email').isEmail().withMessage('Email must be valid'),
		body('password').not().isEmpty().withMessage('Password is required')
	],
	validationMiddleware_validate,
	async (req: Request, res: Response) => {
		const { email, password } = req.body

		const user = await User.findOne({ email })
		if (!user) throw new BadRequestError('Invalid credentials')

		const isPasswordCorrect = await bcrypt.compare(password, user.password)
		if (!isPasswordCorrect) throw new BadRequestError('Invalid Credentials')

		const token = jwt.sign(
			{
				id: user.id,
				email: user.email
			},
			process.env.JWT_KEY!
		)

		req.session = {
			jwt: token
		}

		return res.status(200).json(user)
	}
)

const signInRouter = router

export { signInRouter }
