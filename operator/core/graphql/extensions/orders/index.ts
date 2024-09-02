import gql from 'graphql-tag'
import { MutationResolvers, QueryResolvers } from '@/types/resolvers'

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
				const orders = await db.order.findMany()
				return orders
			},
		},
		// TODO: Add get order by person, get order by id, get order by pool key, get order by status
	},
	Mutation: {
		createOrder: {
			resolve: async (
				_parent,
				{
					input: {
						walletAddress,
						tickToSellAt,
						zeroForOne,
						inputAmount,
						outputAmount,
						poolKey,
						permit2Signature,
						startTime,
						deadline,
					},
				},
				{ getDb }
			) => {
				const db = getDb()
				// TODO: Create a function here to valiate inputs
				// then create the pool key (or find it)
				// and then create the order

				// TODO: Once this is done, we should also figure out how to
				// validate hooks and pool keys on chain
				const _poolKey = await db.poolKey.findOrCreate({
					where: {
						token0: poolKey.token0,
						token1: poolKey.token1,
						fee: poolKey.fee,
						tickSpacing: poolKey.tickSpacing,
						hooks: poolKey.hooks,
					},
					create: poolKey,
				})
				const order = await db.order.findOrCreate({
					where: {
						trader: walletAddress,
						tickToSellAt,
						zeroForOne,
						inputAmount,
						outputAmount,
						poolKeyId: _poolKey.id,
						permit2Signature,
						startTime,
						deadline,
					},
					create: {
						walletAddress,
						tickToSellAt,
						zeroForOne,
						inputAmount,
						outputAmount,
						poolKey: _poolKey,
						permit2Signature,
						startTime,
						deadline,
					},
					update: {},
					include: {
						poolKey: true,
					},
				})
				return order
			},
		},
	},
}
