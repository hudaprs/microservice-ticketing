// NATS
import { Stan } from 'node-nats-streaming'

// Subjects
import { Subjects } from './subjects'

interface Event {
	subject: Subjects
	data: any
}

abstract class Publisher<T extends Event> {
	abstract subject: T['subject']
	private client: Stan

	constructor(client: Stan) {
		this.client = client
	}

	/**
	 * @description Publish some event
	 *
	 * @param {T['data']} data
	 *
	 * @return {Promise<void>} Promise<void>
	 */
	publish(data: T['data']): Promise<void> {
		return new Promise((resolve, reject) => {
			this.client.publish(this.subject, JSON.stringify(data), err => {
				if (err) reject(err)

				console.log(`${this.subject} published`)
				resolve()
			})
		})
	}
}

export { Publisher }
