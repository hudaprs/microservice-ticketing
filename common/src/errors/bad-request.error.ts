// Error
import { BaseError, ISerializeErrorResponse } from './base.error'

class BadRequestError extends BaseError {
	statusCode = 400

	constructor(message?: string) {
		super(message)

		Object.setPrototypeOf(this, BadRequestError.prototype)
	}

	serializeErrors(): ISerializeErrorResponse[] {
		return [{ message: this.message || 'Bad Request' }]
	}
}

export { BadRequestError }
