import { gql } from '@apollo/client'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { GetOrders, GetOrdersVariables } from '@/types/operator'
import { getGraphQLClient } from '@/graphql'

export const fetchOrdersAction = createAsyncThunk(
	'orders/fetchOrders',
	async (variables: GetOrdersVariables) => {
		const response = await getGraphQLClient().query<
			GetOrders,
			GetOrdersVariables
		>({
			query: gql`
				query GetOrders {
					orders {
						id
						trader
						tickToSellAt
						zeroForOne
						amountSpecified
						poolKey {
							token0
							token1
							fee
							tickSpacing
							hooks
						}
						permit2Signature
						startTime
						deadline
					}
				}
			`,
			variables,
			fetchPolicy: 'no-cache',
		})

		return response.data.orders
	}
)

export const createOrderAction = createAsyncThunk(
	'orders/createOrder',
	async (variables: any) => {
		const response = await getGraphQLClient().mutate({
			mutation: gql`
				mutation CreateOrder($input: CreateOrderInput!) {
					createOrder(input: $input) {
						trader
						tickToSellAt
						zeroForOne
						amountSpecified
						poolKey {
							token0
							token1
							fee
							tickSpacing
							hooks
						}
						startTime
						deadline
					}
				}
			`,
			variables: {
				input: {
					trader: variables.walletAddress,
					tickToSellAt: '197949',
					amountSpecified: '100000000000000000000', // 100 tokens
					zeroForOne: true,
					tokenA: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
					tokenB: '0x0000000000000000000000000000000000000000',
					fee: '3000',
					tickSpacing: '60',
					// TODO: Need to fix  this later and to be dynamic
					hooks: '0x537c407139353f5a6086a4b017fbdd8b179310c8',
					permit2Signature: variables.permit2Signature,
					permit2Deadline: variables.permit2Deadline,
					permit2Nonce: variables.permit2Nonce,
					orderSignature: variables.orderSignature,
				},
			},
		})

		return response.data.createOrder
	}
)
