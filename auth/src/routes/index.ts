// Express
import { Express } from 'express'

// Routes
import { currentUserRouter } from './current-user.router'
import { signInRouter } from './sign-in.router'
import { signUpRouter } from './sign-up.router'
import { signOutRouter } from './sign-out.router'

// Common Modules
import { NotFoundError } from '@hudaprs-ticketing/common'

// Constant
const USER_URL = '/api/users'

const routes = (app: Express) => {
	app.use(USER_URL, currentUserRouter)
	app.use(USER_URL, signInRouter)
	app.use(USER_URL, signUpRouter)
	app.use(USER_URL, signOutRouter)

	// Catch any error
	app.all('*', () => {
		throw new NotFoundError()
	})
}

export { routes, USER_URL }
