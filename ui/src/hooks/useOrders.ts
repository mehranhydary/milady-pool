import { useEffect } from 'react'
import { useDispatch, useSelector } from '@/redux/hooks'
import { fetchOrdersAction, selectOrders } from '@/redux/orders'

export const useOrders = () => {
	const dispatch = useDispatch()
	const orders = useSelector(selectOrders)

	useEffect(() => {
		dispatch(fetchOrdersAction({}))
	}, [dispatch])

	return orders
}
