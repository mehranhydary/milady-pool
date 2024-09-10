import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from '@/redux/hooks'
import {
	createOrderAction,
	fetchOrdersAction,
	selectOrders,
} from '@/redux/orders'

export const useOrders = () => {
	const dispatch = useDispatch()
	const orders = useSelector(selectOrders)

	useEffect(() => {
		dispatch(fetchOrdersAction({}))
	}, [dispatch])

	const createOrder = useCallback(async () => {
		await dispatch(createOrderAction({}))
	}, [dispatch])

	return { orders, createOrder }
}
