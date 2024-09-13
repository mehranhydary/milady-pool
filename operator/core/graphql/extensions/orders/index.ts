import gql from 'graphql-tag'
import { MutationResolvers, QueryResolvers } from '@/types/resolvers'
import { GraphQLError } from 'graphql'
import { ZeroAddress } from 'ethers'

// TODO: Pool Key might give some details about token address and range and what
// not so ensure that you are not capturing more than you need to

// TODO: Figure out fees eventually
export const typeDefs = gql`
	input CreateOrderInput {
		trader: String!
		tickToSellAt: String
		amountSpecified: String!
		zeroForOne: Boolean!
		tokenA: String!
		tokenB: String!
		fee: String!
		tickSpacing: String!
		hooks: String # Figure out if we need to store hooks in an array or...
		permit2Signature: String!
		orderSignature: String!
		permit2Nonce: String!
		permit2Deadline: ISO8601Date!
		startTime: ISO8601Date
		# Set this to a default of 1 week from now
		deadline: ISO8601Date
	}

	type Order {
		id: String!
		trader: String!
		tickToSellAt: String!
		zeroForOne: Boolean!
		amountSpecified: String!
		# TODO: Add partial fills
		poolKey: PoolKey!
		permit2Signature: String!
		startTime: ISO8601Date!
		deadline: ISO8601Date!
		orderSignature: String!
		permit2Nonce: String!
		permit2Deadline: ISO8601Date!
	}

	type PoolKey {
		id: String!
		token0: String!
		token1: String!
		fee: String!
		tickSpacing: String!
		hooks: String! # Figure out if we need to store hooks in an array or...
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
				const orders = await db.order.findMany({
					include: { poolKey: true },
				})
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
						amountSpecified,
						tokenA,
						tokenB,
						zeroForOne,
						hooks: _hooks,
						fee,
						tickSpacing,
						permit2Signature,
						startTime,
						deadline,
						orderSignature,
						permit2Nonce,
						permit2Deadline,
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
				if (!amountSpecified)
					throw new GraphQLError('amountSpecified is required')
				if (!permit2Deadline)
					throw new GraphQLError('permit2Deadline is required')
				const hooks = _hooks || ZeroAddress
				try {
					const [token0, token1] =
						tokenA < tokenB ? [tokenA, tokenB] : [tokenB, tokenA]
					const poolKey = await db.poolKey.findOrCreate({
						where: {
							token0,
							token1,
							fee,
							tickSpacing: tickSpacing.toString(),
							hooks,
							token0_token1_fee_tickSpacing_hooks: {
								token0,
								token1,
								fee,
								tickSpacing: tickSpacing.toString(),
								hooks,
							},
						},
						create: {
							token0,
							token1,
							fee,
							tickSpacing: tickSpacing.toString(),
							hooks,
						},
						update: {},
					})
					const _startTime = startTime || new Date()
					const _deadline =
						deadline || new Date(Date.now() + 604800000)
					const order = await db.order.findOrCreate({
						where: {
							trader,
							poolKeyId: poolKey.id,
							trader_tickToSellAt_zeroForOne_startTime_poolKeyId:
								{
									trader,
									tickToSellAt: tickToSellAt
										? tickToSellAt
										: '0',
									zeroForOne,
									startTime: _startTime,
									poolKeyId: poolKey.id,
								},
						},
						create: {
							trader,
							tickToSellAt: tickToSellAt ? tickToSellAt : '0',
							amountSpecified,
							poolKeyId: poolKey.id,
							permit2Signature,
							zeroForOne,
							startTime: _startTime,
							deadline: _deadline,
							orderSignature,
							permit2Nonce,
							permit2Deadline,
						},
						update: {},
						include: {
							poolKey: true,
						},
					})
					return order
				} catch (error) {
					console.error('Error creating order:', error)
					throw new GraphQLError('Failed to create order')
				}
			},
		},
	},
}
