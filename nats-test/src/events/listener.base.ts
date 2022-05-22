// STAN
import { Message, Stan, SubscriptionOptions } from 'node-nats-streaming'

// Subjects
import { Subjects } from './subjects'

interface Event {
	subject: Subjects
	data: any
}

abstract class Listener<T extends Event> {
	abstract subject: T['subject']
	abstract onMessage(data: T['data'], message: Message): void
	abstract queueGroupName: string
	private client: Stan
	protected ackWait: number = 5 * 1000

	constructor(client: Stan) {
		this.client = client
	}

	/**
	 * @description Subscription option for listener
	 *
	 * @return {SubscriptionOptions} SubscriptionOptions
	 */
	subscriptionOptions(): SubscriptionOptions {
		return this.client
			.subscriptionOptions()
			.setDeliverAllAvailable()
			.setManualAckMode(true)
			.setAckWait(this.ackWait)
			.setDurableName(this.queueGroupName)
	}

	/**
	 * @description Parse message from incoming listener
	 *
	 * @param {Message} message
	 *
	 * @return {void} void
	 */
	parseMessage(message: Message): void {
		const data = message.getData()

		return typeof data === 'string'
			? JSON.parse(data)
			: JSON.parse(data.toString('utf8'))
	}

	/**
	 * @description Watch any incoming message from listener
	 *
	 * @return {void} void
	 */
	listen(): void {
		const subscription = this.client.subscribe(
			this.subject,
			this.queueGroupName,
			this.subscriptionOptions()
		)

		subscription.on('message', (message: Message) => {
			console.log(`Message received: ${this.subject} / ${this.queueGroupName}`)

			// Throw the message
			this.onMessage(this.parseMessage(message), message)
		})
	}
}

export { Listener }
