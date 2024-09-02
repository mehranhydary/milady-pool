import gql from 'graphql-tag'

// TODO: Pool Key might give some details about token address and range and what
// not so ensure that you are not capturing more than you need to

// TODO: Figure out fees eventually
export const typeDefs = gql`
	type Order {
		walletAddress: String
		tickToSellAt: Int
		zeroForOne: Boolean
		inputAmount: String
		poolKey: PoolKey
		permit2Signature: String
		startTime: ISO8601Date
		deadline: ISO8601Date
	}

	type PoolKey {
		token0: String
		token1: String
		fee: String
		tickSpacing: Int
		hooks: String # Figure out if we need to store hooks in an array or...
	}

	extend type Query {
		orders: [Order]
	}

	extend type Mutation {
		createOrder(input: CreateOrderInput): Order
	}
`

interface OrdersResolvers {
	Query: {
		orders: () => Promise<any[]>
	}
	Mutation: {
		createOrder: (_: any, { input }: { input: any }) => Promise<any>
	}
}

export const resolvers: OrdersResolvers = {
	Query: {
		orders: async () => {
			return [
				{
					id: '1',
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					status: 'CREATED',
					amount: 100,
				},
			]
		},
		// TODO: Add get order by person, get order by id, get order by pool key, get order by status
	},
	Mutation: {
		createOrder: async (_: any, { input }: { input: any }) => {
			return {
				id: '1',
				...input,
			}
		},
	},
}
