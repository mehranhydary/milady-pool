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
						tokenInput
						inputAmount
						outputAmount
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
						inputAmount
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
					trader: '0x071D9fe61cE306AEF04b7889780f889f444D7BF7',
					tickToSellAt: 197949,
					tokenInput: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
					inputAmount: null,
					outputAmount: '1',
					tokenA: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
					tokenB: '0x0000000000000000000000000000000000000000',
					fee: '500',
					tickSpacing: 10,
					hooks: '0x0000000000000000000000000000000000000000',
					permit2Signature: '',
				},
			},
		})

		return response.data.createOrder
	}
)
