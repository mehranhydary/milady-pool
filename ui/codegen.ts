import 'dotenv/config'
import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
	overwrite: true,
	generates: {
		'src/types/operator.ts': {
			schema: 'http://localhost:8081/graphql',
			documents: './**/*.operator.graphql',
			plugins: [
				'typescript',
				'typescript-operations',
				'fragment-matcher',
			],
		},
	},
	config: {
		maybeValue: 'T | undefined',
		skipTypename: true,
		enumsAsTypes: true,
		allowEnumStringTypes: true,
		omitOperationSuffix: true,
		onlyOperationTypes: true,
		declarationKind: 'interface',
		namingConvention: {
			enumValues: 'keep',
			typeNames: 'keep',
		},
		scalars: {
			Date: 'string',
			ISO8601Date: 'string',
			BigInt: 'string',
			EthereumAddress: 'EthereumAddress',
			TxHash: 'Hex',
			Hex: 'Hex',
		},
	},
}

export default config
