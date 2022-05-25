// NATS
import nats, { Stan } from 'node-nats-streaming'

class NatsWrapper {
	private _client?: Stan

	constructor(client?: Stan) {
		this._client = client
	}

	get client() {
		if (!this._client)
			throw new Error('NATS Client not successfully initiated!')

		return this._client
	}

	connect(clusterId: string, clientId: string, url: string): Promise<void> {
		this._client = nats.connect(clusterId, clientId, { url })

		return new Promise((resolve, reject) => {
			// Handle when connected to NATS
			this.client.on('connect', () => {
				resolve()
			})

			// Handle when some error come from NATS
			this.client.on('error', err => {
				reject(err)
			})
		})
	}
}

const natsWrapper = new NatsWrapper()

export { natsWrapper }
