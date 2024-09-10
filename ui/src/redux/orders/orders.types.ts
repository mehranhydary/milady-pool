export interface OrdersState {
	orders: any[]
	loading: boolean
	error: string | null
}

export type OrdersReducers = {}

export interface Order {
	trader: string
	tickToSellAt: number
	tokenInput: string
	inputAmount: number
	outputAmount: number
	tokenA: string
	tokenB: string
	fee: number
	tickSpacing: number
	hooks: string
	permit2Signature: string
}
