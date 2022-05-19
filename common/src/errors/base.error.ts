interface ISerializeErrorResponse {
	message: string
	field?: string
}

abstract class BaseError extends Error {
	abstract statusCode: number

	constructor(message?: string) {
		super(message)

		Object.setPrototypeOf(this, BaseError.prototype)
	}

	/**
	 * @description Serialize errors
	 *
	 */
	abstract serializeErrors(): ISerializeErrorResponse[]
}

export { BaseError, ISerializeErrorResponse }
