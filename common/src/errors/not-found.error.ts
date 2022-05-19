// Error
import { BaseError, ISerializeErrorResponse } from './base.error'

class NotFoundError extends BaseError {
	statusCode = 404

	constructor(message?: string) {
		super(message)

		Object.setPrototypeOf(this, NotFoundError.prototype)
	}

	serializeErrors(): ISerializeErrorResponse[] {
		return [{ message: this.message || 'Not Found' }]
	}
}

export { NotFoundError }
