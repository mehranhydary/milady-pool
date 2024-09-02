import { MutationResolvers, QueryResolvers } from '@/types/resolvers'
import gql from 'graphql-tag'

// TODO: Pool Key might give some details about token address and range and what
// not so ensure that you are not capturing more than you need to

// TODO: Figure out fees eventually
export const typeDefs = gql`
	input CreateOrderInput {
		walletAddress: String!
		tickToSellAt: Int!
		zeroForOne: Boolean!
		# TODO: Fix this to be a Decimal or BigInt
		inputAmount: String
		outputAmount: String
		poolKey: PoolKeyInput!
		permit2Signature: String!
		startTime: ISO8601Date!
		deadline: ISO8601Date!
	}

	input PoolKeyInput {
		token0: String!
		token1: String!
		fee: String!
		tickSpacing: Int!
		hooks: String # Figure out if we need to store hooks in an array or...
	}

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
		orders: [Order!]!
	}

	extend type Mutation {
		createOrder(input: CreateOrderInput!): Order!
	}
`

interface OrdersResolvers {
	Query: Pick<QueryResolvers, 'orders'>
	Mutation: Pick<MutationResolvers, 'createOrder'>
}

export const resolvers: OrdersResolvers = {
	Query: {
		orders: {
			resolve: async (_parent, _args, { getDb }) => {
				const db = getDb()
				return [
					{
						walletAddress:
							'0x1234567890abcdef1234567890abcdef12345678',
						tickToSellAt: 100,
						zeroForOne: true,
						inputAmount: '1000',
						poolKey: {
							token0: 'ETH',
							token1: 'USDT',
							fee: '0.3%',
							tickSpacing: 60,
							hooks: 'default',
						},
						permit2Signature:
							'0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
						startTime: new Date().toISOString(),
						deadline: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
					},
				]
			},
		},
		// TODO: Add get order by person, get order by id, get order by pool key, get order by status
	},
	Mutation: {
		createOrder: {
			resolve: async (_parent, _args, { getDb }) => {
				const db = getDb()
				return {
					id: '1',
					walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
					tickToSellAt: 100,
					zeroForOne: true,
					inputAmount: '1000',
					poolKey: {
						token0: 'ETH',
						token1: 'USDT',
						fee: '0.3%',
						tickSpacing: 60,
						hooks: 'default',
					},
					permit2Signature:
						'0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
					startTime: new Date().toISOString(),
					deadline: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
				}
			},
		},
	},
}
