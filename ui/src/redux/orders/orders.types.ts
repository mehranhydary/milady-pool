export interface OrdersState {
	orders: any[]
	loading: boolean
	error: string | null
}

export type OrdersReducers = {}

export interface Order {
	trader: string
	tickToSellAt: string
	amountSpecified: string
	tokenA: string
	tokenB: string
	fee: string
	tickSpacing: string
	hooks: string
	permit2Signature: string
	permit2Nonce: string
	permit2Deadline: string
	orderSignature: string
}
