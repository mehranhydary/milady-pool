import gql from 'graphql-tag'
import { MutationResolvers, QueryResolvers } from '@/types/resolvers'

// TODO: Pool Key might give some details about token address and range and what
// not so ensure that you are not capturing more than you need to

// TODO: Figure out fees eventually
export const typeDefs = gql`
	input CreateOrderInput {
		trader: String!
		# Can be current tick
		tickToSellAt: Int
		tokenInput: String!
		# TODO: Fix this to be a Decimal or BigInt
		inputAmount: String
		outputAmount: String
		tokenA: String!
		tokenB: String!
		fee: String!
		tickSpacing: Int!
		hooks: String # Figure out if we need to store hooks in an array or...
		permit2Signature: String!
		startTime: ISO8601Date
		# Set this to a default of 1 week from now
		deadline: ISO8601Date
	}

	type Order {
		trader: String
		tickToSellAt: Int
		zeroForOne: Boolean
		inputAmount: String
		outputAmount: String
		# TODO: Add partial fills
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
						trader,
						tickToSellAt,
						tokenInput,
						inputAmount,
						outputAmount,
						tokenA,
						tokenB,
						hooks,
						fee,
						tickSpacing,
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

				const [token0, token1] =
					tokenA < tokenB ? [tokenA, tokenB] : [tokenB, tokenA]

				const zeroForOne = tokenInput === tokenA

				const poolKey = await db.poolKey.findOrCreate({
					where: {
						token0,
						token1,
						fee,
						tickSpacing,
						hooks,
					},
					create: {
						token0,
						token1,
						fee,
						tickSpacing,
						hooks,
					},
					update: {},
				})

				const _startTime = startTime || new Date()
				const _deadline = deadline || new Date(Date.now() + 604800000)

				const order = await db.order.findOrCreate({
					where: {
						trader,
						tickToSellAt,
						inputAmount,
						outputAmount,
						zeroForOne,
						poolKeyId: poolKey.id,
						permit2Signature,
						startTime: _startTime,
						deadline: _deadline,
					},
					create: {
						trader,
						tickToSellAt,
						inputAmount,
						outputAmount,
						poolKey,
						permit2Signature,
						startTime: _startTime,
						deadline: _deadline,
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
