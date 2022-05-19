// Error
import { BaseError, ISerializeErrorResponse } from './base.error'

// Express Validator
import { ValidationError as ExpressValidationError } from 'express-validator'

class ValidationError extends BaseError {
	statusCode = 422

	constructor(private errors: ExpressValidationError[]) {
		super()

		Object.setPrototypeOf(this, ValidationError.prototype)
	}

	serializeErrors(): ISerializeErrorResponse[] {
		return this.errors.map(({ msg, param }) => ({
			message: msg,
			field: param
		}))
	}
}

export { ValidationError }
