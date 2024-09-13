import {
	AbiCoder,
	Contract,
	hexlify,
	JsonRpcProvider,
	randomBytes,
	SigningKey,
	Wallet,
	ZeroAddress,
} from 'ethers'
import { delegationManagerAbi } from './abis/delegationManagerAbi'
import { stakeRegistryAbi } from './abis/stakeRegistryAbi'
import { avsDirectoryAbi } from './abis/avsDirectoryAbi'
import { miladyPoolTaskManagerAbi } from './abis/miladyPoolTaskManagerAbi'
import { getDb } from '../db/getDb'
import { Order, PoolKey } from '@prisma/client'

type OrderWithPoolKey = Order & { poolKey: PoolKey }

const provider = new JsonRpcProvider(
	process.env.RPC_URL || 'http://localhost:8545'
)

const wallet = new Wallet(process.env.PRIVATE_KEY as string, provider)

const delegationManagerAddress = process.env.DELEGATION_MANAGER_ADDRESS!
const miladyPoolTaskManagerContractAddress =
	process.env.MILADY_POOL_CONTRACT_ADDRESS!
const stakeRegistryAddress = process.env.STAKE_REGISTRY_ADDRESS!
const avsDirectoryAddress = process.env.AVS_DIRECTORY_ADDRESS!

const delegationManagerContract = new Contract(
	delegationManagerAddress,
	delegationManagerAbi,
	wallet
)
const miladyPoolContract = new Contract(
	miladyPoolTaskManagerContractAddress,
	miladyPoolTaskManagerAbi,
	wallet
)
const stakeRegistryContract = new Contract(
	stakeRegistryAddress,
	stakeRegistryAbi,
	wallet
)
const avsDirectoryContract = new Contract(
	avsDirectoryAddress,
	avsDirectoryAbi,
	wallet
)

const submitValidOrder = async (order: OrderWithPoolKey) => {
	const abiEncoder = AbiCoder.defaultAbiCoder()
	const orderEncoded = abiEncoder.encode(
		['address', 'bytes', 'uint256', 'uint256'],
		[
			order.trader,
			order.permit2Signature,
			order.permit2Nonce,
			order.permit2Deadline,
		]
	)
	const encodedData = abiEncoder.encode(
		['bytes', 'bytes'],
		// TODO: Add signature
		[orderEncoded, order.orderSignature]
	)
	const tx = await miladyPoolContract.swap(
		{
			currency0: order.poolKey.token0,
			currency1: order.poolKey.token1,
			fee: order.poolKey.fee,
			tickSpacing: order.poolKey.tickSpacing,
			hooks: order.poolKey.hooks,
		},
		{
			zeroForOne: true,
			amountSpecified: 0, // Obscured because of dark pool
			sqrtPriceLimitX96: order.tickToSellAt, // TODO: Calculate this value from Tick
		},
		encodedData // Has encoded order and signature
	)

	await tx.wait()
	console.log('Order sent to MiladyPoolTaskManager')
}

export const monitorNewTicks = async () => {
	miladyPoolContract.on('TickUpdated', async (tick: number) => {
		console.log(
			'Tick updated... check orders in the db to see if any qualify'
		)

		const validOrders = await getValidOrders(tick)
		for (const order of validOrders) {
			await submitValidOrder(order)
		}
	})

	console.log('Monitoring tick updates...')
}

const getValidOrders = async (tick: number): Promise<OrderWithPoolKey[]> => {
	console.log(`Fetching valid orders for tick: ${tick}`)
	const db = getDb()
	const orders = await db.order.findMany({
		where: {
			deadline: {
				gt: new Date(),
			},
		},
		include: {
			poolKey: true,
		},
	})
	console.log(`Fetched ${orders.length} orders from the database`)
	const validOrders = orders.filter((order: any) => {
		const isValid = order.params.zeroForOne
			? order.tokenInput === order.poolKey.token0 &&
			  tick <= order.tickToSellAt
			: order.tokenInput === order.poolKey.token1 &&
			  tick >= order.tickToSellAt
		console.log(
			`Order ${order.id} is ${
				isValid ? 'valid' : 'invalid'
			} for tick: ${tick}`
		)
		return isValid
	})
	console.log(`Found ${validOrders.length} valid orders for tick: ${tick}`)
	return validOrders
}

export const registerOperator = async () => {
	console.log('Registering operator for MiladyPool')

	const tx1 = await delegationManagerContract.registerAsOperator(
		{
			earningsReceiver: await wallet.address,
			delegationApprover: ZeroAddress,
			stakerOptOutWindowBlocks: 0,
		},
		''
	)

	await tx1.wait()

	console.log('Operator registered on Eigenlayer successfully')

	const salt = hexlify(randomBytes(32))
	const expiry = Math.floor(Date.now() / 1000) + 3600

	const digestHash =
		await avsDirectoryContract.calculateOperatorAVSRegistrationDigestHash(
			await wallet.address,
			miladyPoolContract.address,
			salt,
			expiry
		)

	const signingKey = new SigningKey(process.env.PRIVATE_KEY as string)
	const signature = signingKey.sign(digestHash)

	const operatorSignature = {
		expiry,
		salt,
		signature,
	}

	const tx2 = await stakeRegistryContract.registerOperatorWithSignature(
		operatorSignature,
		await wallet.address
	)

	await tx2.wait()
	console.log('Operator registered on AVS successfully')
}
