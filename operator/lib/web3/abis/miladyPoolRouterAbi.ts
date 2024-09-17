export const miladyPoolRouterAbi = [
	{
		type: 'constructor',
		inputs: [
			{
				name: '_manager',
				type: 'address',
				internalType: 'contract IPoolManager',
			},
		],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'PERMIT2',
		inputs: [],
		outputs: [{ name: '', type: 'address', internalType: 'address' }],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'cancelOrder',
		inputs: [
			{
				name: 'order',
				type: 'tuple',
				internalType: 'struct PublicValuesStruct',
				components: [
					{
						name: 'walletAddress',
						type: 'address',
						internalType: 'address',
					},
					{
						name: 'permit2Signature',
						type: 'bytes',
						internalType: 'bytes',
					},
					{
						name: 'permit2Nonce',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'permit2Deadline',
						type: 'uint256',
						internalType: 'uint256',
					},
				],
			},
			{
				name: 'sig',
				type: 'tuple',
				internalType: 'struct Sig',
				components: [
					{ name: 'v', type: 'uint8', internalType: 'uint8' },
					{ name: 'r', type: 'bytes32', internalType: 'bytes32' },
					{ name: 's', type: 'bytes32', internalType: 'bytes32' },
				],
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'cancelledOrFinalized',
		inputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
		outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'hashToSign',
		inputs: [
			{
				name: '_publicValues',
				type: 'tuple',
				internalType: 'struct PublicValuesStruct',
				components: [
					{
						name: 'walletAddress',
						type: 'address',
						internalType: 'address',
					},
					{
						name: 'permit2Signature',
						type: 'bytes',
						internalType: 'bytes',
					},
					{
						name: 'permit2Nonce',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'permit2Deadline',
						type: 'uint256',
						internalType: 'uint256',
					},
				],
			},
		],
		outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
		stateMutability: 'pure',
	},
	{
		type: 'function',
		name: 'manager',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'address',
				internalType: 'contract IPoolManager',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'swap',
		inputs: [
			{
				name: 'key',
				type: 'tuple',
				internalType: 'struct PoolKey',
				components: [
					{
						name: 'currency0',
						type: 'address',
						internalType: 'Currency',
					},
					{
						name: 'currency1',
						type: 'address',
						internalType: 'Currency',
					},
					{ name: 'fee', type: 'uint24', internalType: 'uint24' },
					{
						name: 'tickSpacing',
						type: 'int24',
						internalType: 'int24',
					},
					{
						name: 'hooks',
						type: 'address',
						internalType: 'contract IHooks',
					},
				],
			},
			{
				name: 'params',
				type: 'tuple',
				internalType: 'struct IPoolManager.SwapParams',
				components: [
					{ name: 'zeroForOne', type: 'bool', internalType: 'bool' },
					{
						name: 'amountSpecified',
						type: 'int256',
						internalType: 'int256',
					},
					{
						name: 'sqrtPriceLimitX96',
						type: 'uint160',
						internalType: 'uint160',
					},
				],
			},
			{ name: 'hookData', type: 'bytes', internalType: 'bytes' },
		],
		outputs: [
			{ name: 'delta', type: 'int256', internalType: 'BalanceDelta' },
		],
		stateMutability: 'payable',
	},
	{
		type: 'function',
		name: 'unlockCallback',
		inputs: [{ name: 'rawData', type: 'bytes', internalType: 'bytes' }],
		outputs: [{ name: '', type: 'bytes', internalType: 'bytes' }],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'validateOrder',
		inputs: [
			{
				name: 'order',
				type: 'tuple',
				internalType: 'struct PublicValuesStruct',
				components: [
					{
						name: 'walletAddress',
						type: 'address',
						internalType: 'address',
					},
					{
						name: 'permit2Signature',
						type: 'bytes',
						internalType: 'bytes',
					},
					{
						name: 'permit2Nonce',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'permit2Deadline',
						type: 'uint256',
						internalType: 'uint256',
					},
				],
			},
			{
				name: 'sig',
				type: 'tuple',
				internalType: 'struct Sig',
				components: [
					{ name: 'v', type: 'uint8', internalType: 'uint8' },
					{ name: 'r', type: 'bytes32', internalType: 'bytes32' },
					{ name: 's', type: 'bytes32', internalType: 'bytes32' },
				],
			},
		],
		outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
		stateMutability: 'view',
	},
	{ type: 'error', name: 'InvalidOrder', inputs: [] },
	{ type: 'error', name: 'UnsafeCast', inputs: [] },
]
