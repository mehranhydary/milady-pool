import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit'
import { initialState } from './orders.constants'
import { fetchOrdersAction, createOrderAction } from './orders.actions'
import { OrdersReducers, OrdersState } from './orders.types'

export const OrdersSlice: Slice<OrdersState, OrdersReducers, 'orders'> =
	createSlice<OrdersState, OrdersReducers, 'orders'>({
		name: 'orders',
		initialState,
		reducers: {},
		extraReducers: (builder) => {
			builder
				.addCase(fetchOrdersAction.pending, (state) => {
					state.loading = true
					state.error = null
				})
				.addCase(
					fetchOrdersAction.fulfilled,
					(state, action: PayloadAction<any[]>) => {
						state.orders = action.payload
						state.loading = false
					}
				)
				.addCase(fetchOrdersAction.rejected, (state, action) => {
					state.loading = false
					state.error =
						action.error.message || 'Failed to fetch orders'
				})
				// NOTE: Do not update the new order here because it is not part of the orders state
				// and after it is created in the database, we should wipe this out
				.addCase(createOrderAction.pending, (state) => {
					state.loading = true
					state.error = null
				})
				.addCase(
					createOrderAction.fulfilled,
					(state, action: PayloadAction<any>) => {
						state.orders.push(action.payload)
						state.loading = false
					}
				)
				.addCase(createOrderAction.rejected, (state, action) => {
					state.loading = false
					state.error =
						action.error.message || 'Failed to create order'
				})
		},
	})

export const {} = OrdersSlice.actions
export const ordersReducer = OrdersSlice.reducer
