// Bull
import Queue from 'bull'

// NATS Wrapper
import { natsWrapper } from '../nats-wrapper'

// Events
import { ExpirationCompletePublisher } from '../events'

interface Payload {
	orderId: string
}

const orderExpirationQueue = new Queue<Payload>('order:expiration', {
	redis: {
		host: process.env.REDIS_URL
	}
})

orderExpirationQueue.process(async job => {
	new ExpirationCompletePublisher(natsWrapper.client).publish({
		orderId: job.data.orderId
	})
})

export { orderExpirationQueue }
