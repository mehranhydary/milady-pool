import { gql } from '@apollo/client'
import { createAsyncThunk } from '@reduxjs/toolkit'
import GET_ORDERS from '@/graphql/queries/getOrders.operator.graphql'
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
			variables,
		})

		return response.data.createOrder
	}
)
