import {
	createPublicClient,
	http,
	encodeFunctionData,
	keccak256,
	encodePacked,
	encodeAbiParameters,
} from 'viem'
import {
	PERMIT2_ADDRESS,
	SignatureTransfer,
	TokenPermissions,
	PermitTransferFrom,
} from '@uniswap/Permit2-sdk'
import { localhost } from 'viem/chains'
import { permit2Abi, erc20Abi, miladyPoolRouterAbi } from './abis'

const client = createPublicClient({
	chain: localhost,
	transport: http(),
})

export const createTokenApprovalRawTx = (
	tokenAddress: string,
	spender: string
) => {
	const data = encodeFunctionData({
		abi: erc20Abi,
		functionName: 'approve',
		args: [
			spender,
			'0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
		],
	})

	return data
}

export const createPermit2MessageHash = async (
	tokenAddress: string,
	swapAmount: string // (decimals already applied)
) => {
	const tokenPermissions: TokenPermissions = {
		token: tokenAddress,
		amount: swapAmount,
	}

	const nonce = 0 // You can replace this with the actual nonce value if available
	const deadline = Math.floor(Date.now() / 1000) + 3600 * 24 // 24 hours from the current time

	const permit: PermitTransferFrom = {
		permitted: tokenPermissions,
		spender: PERMIT2_ADDRESS,
		nonce,
		deadline,
	}

	const hash = SignatureTransfer.hash(
		permit,
		PERMIT2_ADDRESS,
		client.chain.id
	)

	return hash
}

export const createOrderAndHashToSign = async (
	walletAddress: string,
	permit2Sig: string,
	permit2Nonce: number,
	permit2Deadline: number
) => {
	const order = {
		walletAddress,
		permit2Nonce,
		permit2Deadline,
		permit2Signature: permit2Sig,
	}

	const hashToSign = await client.readContract({
		address: '0xc3e53f4d16ae77db1c982e75a937b9f60fe63690',
		abi: miladyPoolRouterAbi,
		functionName: 'hashToSign',
		args: [
			[
				order.walletAddress,
				order.permit2Nonce,
				order.permit2Deadline,
				order.permit2Signature,
			],
		],
	})

	return {
		order,
		hashToSign,
	}
}

export const prepareOrderForOperator = async (
	order: {
		walletAddress: string
		permit2Nonce: string
		permit2Deadline: string
		permit2Signature: string
	},
	encodedSignature: string
) => {
	const orderEncoded = encodeAbiParameters(
		[
			{ name: 'walletAddress', type: 'address' },
			{ name: 'permit2Signature', type: 'bytes' },
			{ name: 'permit2Nonce', type: 'uint256' },
			{ name: 'permit2Deadline', type: 'uint256' },
		],
		[
			order.walletAddress as `0x${string}`,
			order.permit2Signature as `0x${string}`,
			BigInt(order.permit2Nonce),
			BigInt(order.permit2Deadline),
		]
	)

	const encodedData = encodeAbiParameters(
		[
			{ name: 'orderEncoded', type: 'bytes' },
			{ name: 'encodedSignature', type: 'bytes' },
		],
		[orderEncoded as `0x${string}`, encodedSignature as `0x${string}`]
	)

	return {
		order,
		encodedData,
	}
}
