import { Contract, JsonRpcProvider, Wallet } from 'ethers'
import { delegationManagerAbi } from './abis/delegationManagerAbi'
import { stakeRegistryAbi } from './abis/stakeRegistryAbi'
import { avsDirectoryAbi } from './abis/avsDirectoryAbi'

const provider = new JsonRpcProvider()
const wallet = new Wallet('', provider)


const miladyPoolAbi = []

const delegationManagerAddress=process.env.DELEGATION_MANAGER_ADDRESS!;
const miladyPoolContractAddress=process.env.MILADY_POOL_CONTRACT_ADDRESS!;
const stakeRegistryAddress=process.env.STAKE_REGISTRY_ADDRESS!;
const avsDirectoryAddress=process.env.AVS_DIRECTORY_ADDRESS!;

const delegationManagerContract = new Contract(
	delegationManagerAddress,
	delegationManagerAbi,
	wallet
)
const miladyPoolContract = new Contract(
	miladyPoolContractAddress,
	miladyPoolAbi,
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

const submitValidOrder = async () => {
  const order = {}
  
  const x = await miladyPoolContract.
}

export const monitorNewTicks = async () => {
	miladyPoolContract.on('TickUpdated', async () => {
		console.log(
			'Tick updated... check orders in the db to see if any qualify'
		)
	})

	console.log('Monitoring tick updates...')
}

