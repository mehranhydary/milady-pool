export const miladyPoolTaskManagerAbi = [
	{
		type: 'constructor',
		inputs: [
			{
				name: '_registryCoordinator',
				type: 'address',
				internalType: 'contract IRegistryCoordinator',
			},
			{
				name: '_poolManager',
				type: 'address',
				internalType: 'contract IPoolManager',
			},
		],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'afterAddLiquidity',
		inputs: [
			{ name: '', type: 'address', internalType: 'address' },
			{
				name: '',
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
				name: '',
				type: 'tuple',
				internalType: 'struct IPoolManager.ModifyLiquidityParams',
				components: [
					{ name: 'tickLower', type: 'int24', internalType: 'int24' },
					{ name: 'tickUpper', type: 'int24', internalType: 'int24' },
					{
						name: 'liquidityDelta',
						type: 'int256',
						internalType: 'int256',
					},
					{ name: 'salt', type: 'bytes32', internalType: 'bytes32' },
				],
			},
			{ name: '', type: 'int256', internalType: 'BalanceDelta' },
			{ name: '', type: 'bytes', internalType: 'bytes' },
		],
		outputs: [
			{ name: '', type: 'bytes4', internalType: 'bytes4' },
			{ name: '', type: 'int256', internalType: 'BalanceDelta' },
		],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'afterDonate',
		inputs: [
			{ name: '', type: 'address', internalType: 'address' },
			{
				name: '',
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
			{ name: '', type: 'uint256', internalType: 'uint256' },
			{ name: '', type: 'uint256', internalType: 'uint256' },
			{ name: '', type: 'bytes', internalType: 'bytes' },
		],
		outputs: [{ name: '', type: 'bytes4', internalType: 'bytes4' }],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'afterInitialize',
		inputs: [
			{ name: '', type: 'address', internalType: 'address' },
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
			{ name: '', type: 'uint160', internalType: 'uint160' },
			{ name: 'tick', type: 'int24', internalType: 'int24' },
			{ name: '', type: 'bytes', internalType: 'bytes' },
		],
		outputs: [{ name: '', type: 'bytes4', internalType: 'bytes4' }],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'afterRemoveLiquidity',
		inputs: [
			{ name: '', type: 'address', internalType: 'address' },
			{
				name: '',
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
				name: '',
				type: 'tuple',
				internalType: 'struct IPoolManager.ModifyLiquidityParams',
				components: [
					{ name: 'tickLower', type: 'int24', internalType: 'int24' },
					{ name: 'tickUpper', type: 'int24', internalType: 'int24' },
					{
						name: 'liquidityDelta',
						type: 'int256',
						internalType: 'int256',
					},
					{ name: 'salt', type: 'bytes32', internalType: 'bytes32' },
				],
			},
			{ name: '', type: 'int256', internalType: 'BalanceDelta' },
			{ name: '', type: 'bytes', internalType: 'bytes' },
		],
		outputs: [
			{ name: '', type: 'bytes4', internalType: 'bytes4' },
			{ name: '', type: 'int256', internalType: 'BalanceDelta' },
		],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'afterSwap',
		inputs: [
			{ name: 'sender', type: 'address', internalType: 'address' },
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
			{ name: 'delta', type: 'int256', internalType: 'BalanceDelta' },
			{ name: 'data', type: 'bytes', internalType: 'bytes' },
		],
		outputs: [
			{ name: '', type: 'bytes4', internalType: 'bytes4' },
			{ name: '', type: 'int128', internalType: 'int128' },
		],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'beforeAddLiquidity',
		inputs: [
			{ name: '', type: 'address', internalType: 'address' },
			{
				name: '',
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
				name: '',
				type: 'tuple',
				internalType: 'struct IPoolManager.ModifyLiquidityParams',
				components: [
					{ name: 'tickLower', type: 'int24', internalType: 'int24' },
					{ name: 'tickUpper', type: 'int24', internalType: 'int24' },
					{
						name: 'liquidityDelta',
						type: 'int256',
						internalType: 'int256',
					},
					{ name: 'salt', type: 'bytes32', internalType: 'bytes32' },
				],
			},
			{ name: '', type: 'bytes', internalType: 'bytes' },
		],
		outputs: [{ name: '', type: 'bytes4', internalType: 'bytes4' }],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'beforeDonate',
		inputs: [
			{ name: '', type: 'address', internalType: 'address' },
			{
				name: '',
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
			{ name: '', type: 'uint256', internalType: 'uint256' },
			{ name: '', type: 'uint256', internalType: 'uint256' },
			{ name: '', type: 'bytes', internalType: 'bytes' },
		],
		outputs: [{ name: '', type: 'bytes4', internalType: 'bytes4' }],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'beforeInitialize',
		inputs: [
			{ name: '', type: 'address', internalType: 'address' },
			{
				name: '',
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
			{ name: '', type: 'uint160', internalType: 'uint160' },
			{ name: '', type: 'bytes', internalType: 'bytes' },
		],
		outputs: [{ name: '', type: 'bytes4', internalType: 'bytes4' }],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'beforeRemoveLiquidity',
		inputs: [
			{ name: '', type: 'address', internalType: 'address' },
			{
				name: '',
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
				name: '',
				type: 'tuple',
				internalType: 'struct IPoolManager.ModifyLiquidityParams',
				components: [
					{ name: 'tickLower', type: 'int24', internalType: 'int24' },
					{ name: 'tickUpper', type: 'int24', internalType: 'int24' },
					{
						name: 'liquidityDelta',
						type: 'int256',
						internalType: 'int256',
					},
					{ name: 'salt', type: 'bytes32', internalType: 'bytes32' },
				],
			},
			{ name: '', type: 'bytes', internalType: 'bytes' },
		],
		outputs: [{ name: '', type: 'bytes4', internalType: 'bytes4' }],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'beforeSwap',
		inputs: [
			{ name: 'sender', type: 'address', internalType: 'address' },
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
			{ name: 'data', type: 'bytes', internalType: 'bytes' },
		],
		outputs: [
			{ name: '', type: 'bytes4', internalType: 'bytes4' },
			{ name: '', type: 'int256', internalType: 'BeforeSwapDelta' },
			{ name: '', type: 'uint24', internalType: 'uint24' },
		],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'blsApkRegistry',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'address',
				internalType: 'contract IBLSApkRegistry',
			},
		],
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
						name: 'tickToSellAt',
						type: 'int24',
						internalType: 'int24',
					},
					{ name: 'zeroForOne', type: 'bool', internalType: 'bool' },
					{
						name: 'inputAmount',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'outputAmount',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'tokenInput',
						type: 'address',
						internalType: 'address',
					},
					{
						name: 'token0',
						type: 'address',
						internalType: 'address',
					},
					{
						name: 'token1',
						type: 'address',
						internalType: 'address',
					},
					{ name: 'fee', type: 'uint24', internalType: 'uint24' },
					{
						name: 'tickSpacing',
						type: 'int24',
						internalType: 'int24',
					},
					{ name: 'hooks', type: 'address', internalType: 'address' },
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
		name: 'checkSignatures',
		inputs: [
			{ name: 'msgHash', type: 'bytes32', internalType: 'bytes32' },
			{ name: 'quorumNumbers', type: 'bytes', internalType: 'bytes' },
			{
				name: 'referenceBlockNumber',
				type: 'uint32',
				internalType: 'uint32',
			},
			{
				name: 'params',
				type: 'tuple',
				internalType:
					'struct IBLSSignatureChecker.NonSignerStakesAndSignature',
				components: [
					{
						name: 'nonSignerQuorumBitmapIndices',
						type: 'uint32[]',
						internalType: 'uint32[]',
					},
					{
						name: 'nonSignerPubkeys',
						type: 'tuple[]',
						internalType: 'struct BN254.G1Point[]',
						components: [
							{
								name: 'X',
								type: 'uint256',
								internalType: 'uint256',
							},
							{
								name: 'Y',
								type: 'uint256',
								internalType: 'uint256',
							},
						],
					},
					{
						name: 'quorumApks',
						type: 'tuple[]',
						internalType: 'struct BN254.G1Point[]',
						components: [
							{
								name: 'X',
								type: 'uint256',
								internalType: 'uint256',
							},
							{
								name: 'Y',
								type: 'uint256',
								internalType: 'uint256',
							},
						],
					},
					{
						name: 'apkG2',
						type: 'tuple',
						internalType: 'struct BN254.G2Point',
						components: [
							{
								name: 'X',
								type: 'uint256[2]',
								internalType: 'uint256[2]',
							},
							{
								name: 'Y',
								type: 'uint256[2]',
								internalType: 'uint256[2]',
							},
						],
					},
					{
						name: 'sigma',
						type: 'tuple',
						internalType: 'struct BN254.G1Point',
						components: [
							{
								name: 'X',
								type: 'uint256',
								internalType: 'uint256',
							},
							{
								name: 'Y',
								type: 'uint256',
								internalType: 'uint256',
							},
						],
					},
					{
						name: 'quorumApkIndices',
						type: 'uint32[]',
						internalType: 'uint32[]',
					},
					{
						name: 'totalStakeIndices',
						type: 'uint32[]',
						internalType: 'uint32[]',
					},
					{
						name: 'nonSignerStakeIndices',
						type: 'uint32[][]',
						internalType: 'uint32[][]',
					},
				],
			},
		],
		outputs: [
			{
				name: '',
				type: 'tuple',
				internalType: 'struct IBLSSignatureChecker.QuorumStakeTotals',
				components: [
					{
						name: 'signedStakeForQuorum',
						type: 'uint96[]',
						internalType: 'uint96[]',
					},
					{
						name: 'totalStakeForQuorum',
						type: 'uint96[]',
						internalType: 'uint96[]',
					},
				],
			},
			{ name: '', type: 'bytes32', internalType: 'bytes32' },
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'delegation',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'address',
				internalType: 'contract IDelegationManager',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'getCheckSignaturesIndices',
		inputs: [
			{
				name: 'registryCoordinator',
				type: 'address',
				internalType: 'contract IRegistryCoordinator',
			},
			{
				name: 'referenceBlockNumber',
				type: 'uint32',
				internalType: 'uint32',
			},
			{ name: 'quorumNumbers', type: 'bytes', internalType: 'bytes' },
			{
				name: 'nonSignerOperatorIds',
				type: 'bytes32[]',
				internalType: 'bytes32[]',
			},
		],
		outputs: [
			{
				name: '',
				type: 'tuple',
				internalType:
					'struct OperatorStateRetriever.CheckSignaturesIndices',
				components: [
					{
						name: 'nonSignerQuorumBitmapIndices',
						type: 'uint32[]',
						internalType: 'uint32[]',
					},
					{
						name: 'quorumApkIndices',
						type: 'uint32[]',
						internalType: 'uint32[]',
					},
					{
						name: 'totalStakeIndices',
						type: 'uint32[]',
						internalType: 'uint32[]',
					},
					{
						name: 'nonSignerStakeIndices',
						type: 'uint32[][]',
						internalType: 'uint32[][]',
					},
				],
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'getHookPermissions',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'tuple',
				internalType: 'struct Hooks.Permissions',
				components: [
					{
						name: 'beforeInitialize',
						type: 'bool',
						internalType: 'bool',
					},
					{
						name: 'afterInitialize',
						type: 'bool',
						internalType: 'bool',
					},
					{
						name: 'beforeAddLiquidity',
						type: 'bool',
						internalType: 'bool',
					},
					{
						name: 'afterAddLiquidity',
						type: 'bool',
						internalType: 'bool',
					},
					{
						name: 'beforeRemoveLiquidity',
						type: 'bool',
						internalType: 'bool',
					},
					{
						name: 'afterRemoveLiquidity',
						type: 'bool',
						internalType: 'bool',
					},
					{ name: 'beforeSwap', type: 'bool', internalType: 'bool' },
					{ name: 'afterSwap', type: 'bool', internalType: 'bool' },
					{
						name: 'beforeDonate',
						type: 'bool',
						internalType: 'bool',
					},
					{ name: 'afterDonate', type: 'bool', internalType: 'bool' },
					{
						name: 'beforeSwapReturnDelta',
						type: 'bool',
						internalType: 'bool',
					},
					{
						name: 'afterSwapReturnDelta',
						type: 'bool',
						internalType: 'bool',
					},
					{
						name: 'afterAddLiquidityReturnDelta',
						type: 'bool',
						internalType: 'bool',
					},
					{
						name: 'afterRemoveLiquidityReturnDelta',
						type: 'bool',
						internalType: 'bool',
					},
				],
			},
		],
		stateMutability: 'pure',
	},
	{
		type: 'function',
		name: 'getLowerUsableTick',
		inputs: [
			{ name: 'tick', type: 'int24', internalType: 'int24' },
			{ name: 'tickSpacing', type: 'int24', internalType: 'int24' },
		],
		outputs: [{ name: '', type: 'int24', internalType: 'int24' }],
		stateMutability: 'pure',
	},
	{
		type: 'function',
		name: 'getOperatorState',
		inputs: [
			{
				name: 'registryCoordinator',
				type: 'address',
				internalType: 'contract IRegistryCoordinator',
			},
			{ name: 'quorumNumbers', type: 'bytes', internalType: 'bytes' },
			{ name: 'blockNumber', type: 'uint32', internalType: 'uint32' },
		],
		outputs: [
			{
				name: '',
				type: 'tuple[][]',
				internalType: 'struct OperatorStateRetriever.Operator[][]',
				components: [
					{
						name: 'operator',
						type: 'address',
						internalType: 'address',
					},
					{
						name: 'operatorId',
						type: 'bytes32',
						internalType: 'bytes32',
					},
					{ name: 'stake', type: 'uint96', internalType: 'uint96' },
				],
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'getOperatorState',
		inputs: [
			{
				name: 'registryCoordinator',
				type: 'address',
				internalType: 'contract IRegistryCoordinator',
			},
			{ name: 'operatorId', type: 'bytes32', internalType: 'bytes32' },
			{ name: 'blockNumber', type: 'uint32', internalType: 'uint32' },
		],
		outputs: [
			{ name: '', type: 'uint256', internalType: 'uint256' },
			{
				name: '',
				type: 'tuple[][]',
				internalType: 'struct OperatorStateRetriever.Operator[][]',
				components: [
					{
						name: 'operator',
						type: 'address',
						internalType: 'address',
					},
					{
						name: 'operatorId',
						type: 'bytes32',
						internalType: 'bytes32',
					},
					{ name: 'stake', type: 'uint96', internalType: 'uint96' },
				],
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'getQuorumBitmapsAtBlockNumber',
		inputs: [
			{
				name: 'registryCoordinator',
				type: 'address',
				internalType: 'contract IRegistryCoordinator',
			},
			{
				name: 'operatorIds',
				type: 'bytes32[]',
				internalType: 'bytes32[]',
			},
			{ name: 'blockNumber', type: 'uint32', internalType: 'uint32' },
		],
		outputs: [{ name: '', type: 'uint256[]', internalType: 'uint256[]' }],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'hashOrder',
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
						name: 'tickToSellAt',
						type: 'int24',
						internalType: 'int24',
					},
					{ name: 'zeroForOne', type: 'bool', internalType: 'bool' },
					{
						name: 'inputAmount',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'outputAmount',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'tokenInput',
						type: 'address',
						internalType: 'address',
					},
					{
						name: 'token0',
						type: 'address',
						internalType: 'address',
					},
					{
						name: 'token1',
						type: 'address',
						internalType: 'address',
					},
					{ name: 'fee', type: 'uint24', internalType: 'uint24' },
					{
						name: 'tickSpacing',
						type: 'int24',
						internalType: 'int24',
					},
					{ name: 'hooks', type: 'address', internalType: 'address' },
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
						name: 'tickToSellAt',
						type: 'int24',
						internalType: 'int24',
					},
					{ name: 'zeroForOne', type: 'bool', internalType: 'bool' },
					{
						name: 'inputAmount',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'outputAmount',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'tokenInput',
						type: 'address',
						internalType: 'address',
					},
					{
						name: 'token0',
						type: 'address',
						internalType: 'address',
					},
					{
						name: 'token1',
						type: 'address',
						internalType: 'address',
					},
					{ name: 'fee', type: 'uint24', internalType: 'uint24' },
					{
						name: 'tickSpacing',
						type: 'int24',
						internalType: 'int24',
					},
					{ name: 'hooks', type: 'address', internalType: 'address' },
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
		name: 'initialize',
		inputs: [
			{
				name: '_pauserRegistry',
				type: 'address',
				internalType: 'contract IPauserRegistry',
			},
			{ name: 'initialOwner', type: 'address', internalType: 'address' },
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'lastTicks',
		inputs: [{ name: 'poolId', type: 'bytes32', internalType: 'PoolId' }],
		outputs: [{ name: 'lastTick', type: 'int24', internalType: 'int24' }],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'owner',
		inputs: [],
		outputs: [{ name: '', type: 'address', internalType: 'address' }],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'pause',
		inputs: [
			{
				name: 'newPausedStatus',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'pauseAll',
		inputs: [],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'paused',
		inputs: [{ name: 'index', type: 'uint8', internalType: 'uint8' }],
		outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'paused',
		inputs: [],
		outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'pauserRegistry',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'address',
				internalType: 'contract IPauserRegistry',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'pendingOrders',
		inputs: [{ name: '', type: 'bytes', internalType: 'bytes' }],
		outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'poolManager',
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
		name: 'registryCoordinator',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'address',
				internalType: 'contract IRegistryCoordinator',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'renounceOwnership',
		inputs: [],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'setPauserRegistry',
		inputs: [
			{
				name: 'newPauserRegistry',
				type: 'address',
				internalType: 'contract IPauserRegistry',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'setStaleStakesForbidden',
		inputs: [{ name: 'value', type: 'bool', internalType: 'bool' }],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'stakeRegistry',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'address',
				internalType: 'contract IStakeRegistry',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'staleStakesForbidden',
		inputs: [],
		outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'transferOwnership',
		inputs: [
			{ name: 'newOwner', type: 'address', internalType: 'address' },
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'trySignatureAndApkVerification',
		inputs: [
			{ name: 'msgHash', type: 'bytes32', internalType: 'bytes32' },
			{
				name: 'apk',
				type: 'tuple',
				internalType: 'struct BN254.G1Point',
				components: [
					{ name: 'X', type: 'uint256', internalType: 'uint256' },
					{ name: 'Y', type: 'uint256', internalType: 'uint256' },
				],
			},
			{
				name: 'apkG2',
				type: 'tuple',
				internalType: 'struct BN254.G2Point',
				components: [
					{
						name: 'X',
						type: 'uint256[2]',
						internalType: 'uint256[2]',
					},
					{
						name: 'Y',
						type: 'uint256[2]',
						internalType: 'uint256[2]',
					},
				],
			},
			{
				name: 'sigma',
				type: 'tuple',
				internalType: 'struct BN254.G1Point',
				components: [
					{ name: 'X', type: 'uint256', internalType: 'uint256' },
					{ name: 'Y', type: 'uint256', internalType: 'uint256' },
				],
			},
		],
		outputs: [
			{ name: 'pairingSuccessful', type: 'bool', internalType: 'bool' },
			{ name: 'siganatureIsValid', type: 'bool', internalType: 'bool' },
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'unlockCallback',
		inputs: [{ name: 'data', type: 'bytes', internalType: 'bytes' }],
		outputs: [{ name: '', type: 'bytes', internalType: 'bytes' }],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'unpause',
		inputs: [
			{
				name: 'newPausedStatus',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [],
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
						name: 'tickToSellAt',
						type: 'int24',
						internalType: 'int24',
					},
					{ name: 'zeroForOne', type: 'bool', internalType: 'bool' },
					{
						name: 'inputAmount',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'outputAmount',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'tokenInput',
						type: 'address',
						internalType: 'address',
					},
					{
						name: 'token0',
						type: 'address',
						internalType: 'address',
					},
					{
						name: 'token1',
						type: 'address',
						internalType: 'address',
					},
					{ name: 'fee', type: 'uint24', internalType: 'uint24' },
					{
						name: 'tickSpacing',
						type: 'int24',
						internalType: 'int24',
					},
					{ name: 'hooks', type: 'address', internalType: 'address' },
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
	{
		type: 'function',
		name: 'validateOrderParameters',
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
						name: 'tickToSellAt',
						type: 'int24',
						internalType: 'int24',
					},
					{ name: 'zeroForOne', type: 'bool', internalType: 'bool' },
					{
						name: 'inputAmount',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'outputAmount',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'tokenInput',
						type: 'address',
						internalType: 'address',
					},
					{
						name: 'token0',
						type: 'address',
						internalType: 'address',
					},
					{
						name: 'token1',
						type: 'address',
						internalType: 'address',
					},
					{ name: 'fee', type: 'uint24', internalType: 'uint24' },
					{
						name: 'tickSpacing',
						type: 'int24',
						internalType: 'int24',
					},
					{ name: 'hooks', type: 'address', internalType: 'address' },
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
		outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
		stateMutability: 'view',
	},
	{
		type: 'event',
		name: 'Initialized',
		inputs: [
			{
				name: 'version',
				type: 'uint8',
				indexed: false,
				internalType: 'uint8',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'OrderCancelled',
		inputs: [
			{
				name: 'proofBytes',
				type: 'bytes',
				indexed: false,
				internalType: 'bytes',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'OrderCreated',
		inputs: [
			{
				name: 'proofBytes',
				type: 'bytes',
				indexed: false,
				internalType: 'bytes',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'OrderFulfilled',
		inputs: [
			{
				name: 'proofBytes',
				type: 'bytes',
				indexed: false,
				internalType: 'bytes',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'OwnershipTransferred',
		inputs: [
			{
				name: 'previousOwner',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'newOwner',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'Paused',
		inputs: [
			{
				name: 'account',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'newPausedStatus',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'PauserRegistrySet',
		inputs: [
			{
				name: 'pauserRegistry',
				type: 'address',
				indexed: false,
				internalType: 'contract IPauserRegistry',
			},
			{
				name: 'newPauserRegistry',
				type: 'address',
				indexed: false,
				internalType: 'contract IPauserRegistry',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'StaleStakesForbiddenUpdate',
		inputs: [
			{
				name: 'value',
				type: 'bool',
				indexed: false,
				internalType: 'bool',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'TickUpdated',
		inputs: [
			{
				name: 'tick',
				type: 'int24',
				indexed: false,
				internalType: 'int24',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'Unpaused',
		inputs: [
			{
				name: 'account',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'newPausedStatus',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{ type: 'error', name: 'HookNotImplemented', inputs: [] },
	{ type: 'error', name: 'InvalidOrder', inputs: [] },
	{ type: 'error', name: 'InvalidPool', inputs: [] },
	{ type: 'error', name: 'LockFailure', inputs: [] },
	{ type: 'error', name: 'NotEnoughToClaim', inputs: [] },
	{ type: 'error', name: 'NotPoolManager', inputs: [] },
	{ type: 'error', name: 'NotSelf', inputs: [] },
	{ type: 'error', name: 'NothingToClaim', inputs: [] },
]
