import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from '@/redux/hooks'
import {
	createOrderAction,
	fetchOrdersAction,
	selectOrders,
} from '@/redux/orders'
import {
	createOrderAndHashToSign,
	createPermit2MessageHash,
	prepareOrderForOperator,
} from '../lib/web3'
import { parseEther, zeroAddress } from 'viem'
import { useAccount, useSignMessage } from 'wagmi'

import { toast } from 'react-toastify'

export const useOrders = () => {
	const dispatch = useDispatch()
	const { address } = useAccount()
	const orders = useSelector(selectOrders)
	const [permit2Nonce, setPermit2Nonce] = useState<number | null>(null)
	const [permit2Deadline, setPermit2Deadline] = useState<number | null>(null)

	const { signMessageAsync } = useSignMessage()

	useEffect(() => {
		dispatch(fetchOrdersAction({}))
	}, [dispatch])

	const createOrder = useCallback(async () => {
		if (!address) {
			console.log('No address found')
			return
		}
		console.log('Address found:', address)
		const {
			hash: permit2Hash,
			nonce: permit2Nonce,
			deadline: permit2Deadline,
		} = await createPermit2MessageHash(
			zeroAddress,
			parseEther('232', 'wei').toString()
		)
		console.log('Permit2 message hash created:', permit2Hash)
		console.log('Permit2 nonce:', permit2Nonce)
		console.log('Permit2 deadline:', permit2Deadline)

		setPermit2Deadline(permit2Deadline)
		setPermit2Nonce(permit2Nonce)

		const data = await signMessageAsync({ message: permit2Hash })
		console.log('Signed permit2 hash:', data)

		const { hashToSign } = await createOrderAndHashToSign(
			address,
			data as string,
			permit2Nonce,
			permit2Deadline
		)
		console.log('Order hash to sign:', hashToSign)
		const dataOrder = await signMessageAsync({
			message: hashToSign as string,
		})
		console.log('Signed order hash:', dataOrder)
		const { order, encodedData } = await prepareOrderForOperator(
			{
				walletAddress: address,
				permit2Nonce: permit2Nonce.toString(),
				permit2Deadline: permit2Deadline.toString(),
				permit2Signature: dataOrder as string,
			},
			dataOrder as string
		)

		dispatch(
			createOrderAction({
				permit2Signature: data,
				orderSignature: dataOrder,
				permit2Nonce: permit2Nonce.toString(),
				permit2Deadline,
				walletAddress: address,
			})
		)
		console.log('Order dispatched')
	}, [
		address,
		setPermit2Nonce,
		setPermit2Deadline,
		signMessageAsync,
		dispatch,
	])

	return { orders, createOrder }
}
