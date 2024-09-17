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

export const erc20Abi = [
	{
		constant: true,
		inputs: [],
		name: 'name',
		outputs: [
			{
				name: '',
				type: 'string',
			},
		],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{
				name: '_spender',
				type: 'address',
			},
			{
				name: '_value',
				type: 'uint256',
			},
		],
		name: 'approve',
		outputs: [
			{
				name: '',
				type: 'bool',
			},
		],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'totalSupply',
		outputs: [
			{
				name: '',
				type: 'uint256',
			},
		],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{
				name: '_from',
				type: 'address',
			},
			{
				name: '_to',
				type: 'address',
			},
			{
				name: '_value',
				type: 'uint256',
			},
		],
		name: 'transferFrom',
		outputs: [
			{
				name: '',
				type: 'bool',
			},
		],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'decimals',
		outputs: [
			{
				name: '',
				type: 'uint8',
			},
		],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: true,
		inputs: [
			{
				name: '_owner',
				type: 'address',
			},
		],
		name: 'balanceOf',
		outputs: [
			{
				name: 'balance',
				type: 'uint256',
			},
		],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'symbol',
		outputs: [
			{
				name: '',
				type: 'string',
			},
		],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{
				name: '_to',
				type: 'address',
			},
			{
				name: '_value',
				type: 'uint256',
			},
		],
		name: 'transfer',
		outputs: [
			{
				name: '',
				type: 'bool',
			},
		],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [
			{
				name: '_owner',
				type: 'address',
			},
			{
				name: '_spender',
				type: 'address',
			},
		],
		name: 'allowance',
		outputs: [
			{
				name: '',
				type: 'uint256',
			},
		],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		payable: true,
		stateMutability: 'payable',
		type: 'fallback',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				name: 'owner',
				type: 'address',
			},
			{
				indexed: true,
				name: 'spender',
				type: 'address',
			},
			{
				indexed: false,
				name: 'value',
				type: 'uint256',
			},
		],
		name: 'Approval',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				name: 'from',
				type: 'address',
			},
			{
				indexed: true,
				name: 'to',
				type: 'address',
			},
			{
				indexed: false,
				name: 'value',
				type: 'uint256',
			},
		],
		name: 'Transfer',
		type: 'event',
	},
]
export const permit2Abi = [
	{
		type: 'function',
		name: 'DOMAIN_SEPARATOR',
		inputs: [],
		outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'allowance',
		inputs: [
			{ name: '', type: 'address', internalType: 'address' },
			{ name: '', type: 'address', internalType: 'address' },
			{ name: '', type: 'address', internalType: 'address' },
		],
		outputs: [
			{ name: 'amount', type: 'uint160', internalType: 'uint160' },
			{ name: 'expiration', type: 'uint48', internalType: 'uint48' },
			{ name: 'nonce', type: 'uint48', internalType: 'uint48' },
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'approve',
		inputs: [
			{ name: 'token', type: 'address', internalType: 'address' },
			{ name: 'spender', type: 'address', internalType: 'address' },
			{ name: 'amount', type: 'uint160', internalType: 'uint160' },
			{ name: 'expiration', type: 'uint48', internalType: 'uint48' },
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'invalidateNonces',
		inputs: [
			{ name: 'token', type: 'address', internalType: 'address' },
			{ name: 'spender', type: 'address', internalType: 'address' },
			{ name: 'newNonce', type: 'uint48', internalType: 'uint48' },
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'invalidateUnorderedNonces',
		inputs: [
			{ name: 'wordPos', type: 'uint256', internalType: 'uint256' },
			{ name: 'mask', type: 'uint256', internalType: 'uint256' },
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'lockdown',
		inputs: [
			{
				name: 'approvals',
				type: 'tuple[]',
				internalType: 'struct IAllowanceTransfer.TokenSpenderPair[]',
				components: [
					{ name: 'token', type: 'address', internalType: 'address' },
					{
						name: 'spender',
						type: 'address',
						internalType: 'address',
					},
				],
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'nonceBitmap',
		inputs: [
			{ name: '', type: 'address', internalType: 'address' },
			{ name: '', type: 'uint256', internalType: 'uint256' },
		],
		outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'permit',
		inputs: [
			{ name: 'owner', type: 'address', internalType: 'address' },
			{
				name: 'permitBatch',
				type: 'tuple',
				internalType: 'struct IAllowanceTransfer.PermitBatch',
				components: [
					{
						name: 'details',
						type: 'tuple[]',
						internalType:
							'struct IAllowanceTransfer.PermitDetails[]',
						components: [
							{
								name: 'token',
								type: 'address',
								internalType: 'address',
							},
							{
								name: 'amount',
								type: 'uint160',
								internalType: 'uint160',
							},
							{
								name: 'expiration',
								type: 'uint48',
								internalType: 'uint48',
							},
							{
								name: 'nonce',
								type: 'uint48',
								internalType: 'uint48',
							},
						],
					},
					{
						name: 'spender',
						type: 'address',
						internalType: 'address',
					},
					{
						name: 'sigDeadline',
						type: 'uint256',
						internalType: 'uint256',
					},
				],
			},
			{ name: 'signature', type: 'bytes', internalType: 'bytes' },
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'permit',
		inputs: [
			{ name: 'owner', type: 'address', internalType: 'address' },
			{
				name: 'permitSingle',
				type: 'tuple',
				internalType: 'struct IAllowanceTransfer.PermitSingle',
				components: [
					{
						name: 'details',
						type: 'tuple',
						internalType: 'struct IAllowanceTransfer.PermitDetails',
						components: [
							{
								name: 'token',
								type: 'address',
								internalType: 'address',
							},
							{
								name: 'amount',
								type: 'uint160',
								internalType: 'uint160',
							},
							{
								name: 'expiration',
								type: 'uint48',
								internalType: 'uint48',
							},
							{
								name: 'nonce',
								type: 'uint48',
								internalType: 'uint48',
							},
						],
					},
					{
						name: 'spender',
						type: 'address',
						internalType: 'address',
					},
					{
						name: 'sigDeadline',
						type: 'uint256',
						internalType: 'uint256',
					},
				],
			},
			{ name: 'signature', type: 'bytes', internalType: 'bytes' },
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'permitTransferFrom',
		inputs: [
			{
				name: 'permit',
				type: 'tuple',
				internalType: 'struct ISignatureTransfer.PermitTransferFrom',
				components: [
					{
						name: 'permitted',
						type: 'tuple',
						internalType:
							'struct ISignatureTransfer.TokenPermissions',
						components: [
							{
								name: 'token',
								type: 'address',
								internalType: 'address',
							},
							{
								name: 'amount',
								type: 'uint256',
								internalType: 'uint256',
							},
						],
					},
					{ name: 'nonce', type: 'uint256', internalType: 'uint256' },
					{
						name: 'deadline',
						type: 'uint256',
						internalType: 'uint256',
					},
				],
			},
			{
				name: 'transferDetails',
				type: 'tuple',
				internalType:
					'struct ISignatureTransfer.SignatureTransferDetails',
				components: [
					{ name: 'to', type: 'address', internalType: 'address' },
					{
						name: 'requestedAmount',
						type: 'uint256',
						internalType: 'uint256',
					},
				],
			},
			{ name: 'owner', type: 'address', internalType: 'address' },
			{ name: 'signature', type: 'bytes', internalType: 'bytes' },
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'permitTransferFrom',
		inputs: [
			{
				name: 'permit',
				type: 'tuple',
				internalType:
					'struct ISignatureTransfer.PermitBatchTransferFrom',
				components: [
					{
						name: 'permitted',
						type: 'tuple[]',
						internalType:
							'struct ISignatureTransfer.TokenPermissions[]',
						components: [
							{
								name: 'token',
								type: 'address',
								internalType: 'address',
							},
							{
								name: 'amount',
								type: 'uint256',
								internalType: 'uint256',
							},
						],
					},
					{ name: 'nonce', type: 'uint256', internalType: 'uint256' },
					{
						name: 'deadline',
						type: 'uint256',
						internalType: 'uint256',
					},
				],
			},
			{
				name: 'transferDetails',
				type: 'tuple[]',
				internalType:
					'struct ISignatureTransfer.SignatureTransferDetails[]',
				components: [
					{ name: 'to', type: 'address', internalType: 'address' },
					{
						name: 'requestedAmount',
						type: 'uint256',
						internalType: 'uint256',
					},
				],
			},
			{ name: 'owner', type: 'address', internalType: 'address' },
			{ name: 'signature', type: 'bytes', internalType: 'bytes' },
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'permitWitnessTransferFrom',
		inputs: [
			{
				name: 'permit',
				type: 'tuple',
				internalType: 'struct ISignatureTransfer.PermitTransferFrom',
				components: [
					{
						name: 'permitted',
						type: 'tuple',
						internalType:
							'struct ISignatureTransfer.TokenPermissions',
						components: [
							{
								name: 'token',
								type: 'address',
								internalType: 'address',
							},
							{
								name: 'amount',
								type: 'uint256',
								internalType: 'uint256',
							},
						],
					},
					{ name: 'nonce', type: 'uint256', internalType: 'uint256' },
					{
						name: 'deadline',
						type: 'uint256',
						internalType: 'uint256',
					},
				],
			},
			{
				name: 'transferDetails',
				type: 'tuple',
				internalType:
					'struct ISignatureTransfer.SignatureTransferDetails',
				components: [
					{ name: 'to', type: 'address', internalType: 'address' },
					{
						name: 'requestedAmount',
						type: 'uint256',
						internalType: 'uint256',
					},
				],
			},
			{ name: 'owner', type: 'address', internalType: 'address' },
			{ name: 'witness', type: 'bytes32', internalType: 'bytes32' },
			{
				name: 'witnessTypeString',
				type: 'string',
				internalType: 'string',
			},
			{ name: 'signature', type: 'bytes', internalType: 'bytes' },
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'permitWitnessTransferFrom',
		inputs: [
			{
				name: 'permit',
				type: 'tuple',
				internalType:
					'struct ISignatureTransfer.PermitBatchTransferFrom',
				components: [
					{
						name: 'permitted',
						type: 'tuple[]',
						internalType:
							'struct ISignatureTransfer.TokenPermissions[]',
						components: [
							{
								name: 'token',
								type: 'address',
								internalType: 'address',
							},
							{
								name: 'amount',
								type: 'uint256',
								internalType: 'uint256',
							},
						],
					},
					{ name: 'nonce', type: 'uint256', internalType: 'uint256' },
					{
						name: 'deadline',
						type: 'uint256',
						internalType: 'uint256',
					},
				],
			},
			{
				name: 'transferDetails',
				type: 'tuple[]',
				internalType:
					'struct ISignatureTransfer.SignatureTransferDetails[]',
				components: [
					{ name: 'to', type: 'address', internalType: 'address' },
					{
						name: 'requestedAmount',
						type: 'uint256',
						internalType: 'uint256',
					},
				],
			},
			{ name: 'owner', type: 'address', internalType: 'address' },
			{ name: 'witness', type: 'bytes32', internalType: 'bytes32' },
			{
				name: 'witnessTypeString',
				type: 'string',
				internalType: 'string',
			},
			{ name: 'signature', type: 'bytes', internalType: 'bytes' },
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'transferFrom',
		inputs: [
			{
				name: 'transferDetails',
				type: 'tuple[]',
				internalType:
					'struct IAllowanceTransfer.AllowanceTransferDetails[]',
				components: [
					{ name: 'from', type: 'address', internalType: 'address' },
					{ name: 'to', type: 'address', internalType: 'address' },
					{
						name: 'amount',
						type: 'uint160',
						internalType: 'uint160',
					},
					{ name: 'token', type: 'address', internalType: 'address' },
				],
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'transferFrom',
		inputs: [
			{ name: 'from', type: 'address', internalType: 'address' },
			{ name: 'to', type: 'address', internalType: 'address' },
			{ name: 'amount', type: 'uint160', internalType: 'uint160' },
			{ name: 'token', type: 'address', internalType: 'address' },
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'event',
		name: 'Approval',
		inputs: [
			{
				name: 'owner',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'token',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'spender',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'amount',
				type: 'uint160',
				indexed: false,
				internalType: 'uint160',
			},
			{
				name: 'expiration',
				type: 'uint48',
				indexed: false,
				internalType: 'uint48',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'Lockdown',
		inputs: [
			{
				name: 'owner',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'token',
				type: 'address',
				indexed: false,
				internalType: 'address',
			},
			{
				name: 'spender',
				type: 'address',
				indexed: false,
				internalType: 'address',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'NonceInvalidation',
		inputs: [
			{
				name: 'owner',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'token',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'spender',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'newNonce',
				type: 'uint48',
				indexed: false,
				internalType: 'uint48',
			},
			{
				name: 'oldNonce',
				type: 'uint48',
				indexed: false,
				internalType: 'uint48',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'Permit',
		inputs: [
			{
				name: 'owner',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'token',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'spender',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'amount',
				type: 'uint160',
				indexed: false,
				internalType: 'uint160',
			},
			{
				name: 'expiration',
				type: 'uint48',
				indexed: false,
				internalType: 'uint48',
			},
			{
				name: 'nonce',
				type: 'uint48',
				indexed: false,
				internalType: 'uint48',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'UnorderedNonceInvalidation',
		inputs: [
			{
				name: 'owner',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'word',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
			{
				name: 'mask',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'error',
		name: 'AllowanceExpired',
		inputs: [
			{ name: 'deadline', type: 'uint256', internalType: 'uint256' },
		],
	},
	{ type: 'error', name: 'ExcessiveInvalidation', inputs: [] },
	{
		type: 'error',
		name: 'InsufficientAllowance',
		inputs: [{ name: 'amount', type: 'uint256', internalType: 'uint256' }],
	},
	{
		type: 'error',
		name: 'InvalidAmount',
		inputs: [
			{ name: 'maxAmount', type: 'uint256', internalType: 'uint256' },
		],
	},
	{ type: 'error', name: 'InvalidContractSignature', inputs: [] },
	{ type: 'error', name: 'InvalidNonce', inputs: [] },
	{ type: 'error', name: 'InvalidSignature', inputs: [] },
	{ type: 'error', name: 'InvalidSignatureLength', inputs: [] },
	{ type: 'error', name: 'InvalidSigner', inputs: [] },
	{ type: 'error', name: 'LengthMismatch', inputs: [] },
	{
		type: 'error',
		name: 'SignatureExpired',
		inputs: [
			{
				name: 'signatureDeadline',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
	},
]
