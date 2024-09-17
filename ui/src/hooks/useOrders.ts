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
	}, [address, signMessageAsync, dispatch])

	return { orders, createOrder }
}
