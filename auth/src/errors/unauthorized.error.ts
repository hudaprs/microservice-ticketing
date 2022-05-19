// Error
import { BaseError, ISerializeErrorResponse } from './base.error'

class UnauthorizedError extends BaseError {
	statusCode = 401

	constructor(message?: string) {
		super(message)

		Object.setPrototypeOf(this, UnauthorizedError.prototype)
	}

	serializeErrors(): ISerializeErrorResponse[] {
		return [{ message: this.message || 'Unauthorized' }]
	}
}

export { UnauthorizedError }
