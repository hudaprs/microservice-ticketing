enum Subjects {
	TicketCreated = 'ticket:created',
	TicketUpdated = 'ticket:updated',

	OrderCreated = 'order:created',
	OrderCancelled = 'order:cancelled',
	OrderComplete = 'order:complete',

	ExpirationComplete = 'expiration:complete',

	PaymentCreated = 'payment:created'
}

export { Subjects }
