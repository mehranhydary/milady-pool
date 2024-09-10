export const initialState = {
	orders: [],
	loading: false,
	error: null,
	newOrder: {
		trader: '',
		tickToSellAt: 0,
		tokenInput: '',
		inputAmount: 0,
		outputAmount: 0,
		tokenA: '',
		tokenB: '',
		fee: 0,
		tickSpacing: 0,
		hooks: '',
		permit2Signature: '',
	},
}
