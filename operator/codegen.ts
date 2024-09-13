import 'dotenv/config'
import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
	overwrite: true,
	generates: {
		'core/types/queries.ts': {
			schema: 'http://localhost:8081/graphql',
			plugins: [
				'typescript',
				'typescript-operations',
				'fragment-matcher',
			],
		},
		'core/types/resolvers.ts': {
			plugins: [
				'@graphql-codegen/typescript',
				'@graphql-codegen/typescript-resolvers',
			],
			schema: ['./core/graphql/extensions/*/**'],
			config: {
				contextType: '../graphql/schema#GraphqlContext',
				rootValueType: '../graphql/schema#RootValue',
				useIndexSignature: true,
				printFieldsOnNewLines: true,
				scalars: {
					ISO8601Date: 'string | Date',
					BigInt: {
						input: 'bigint',
						output: 'bigint | string',
					},
					EthereumAddress: 'string | Hex',
					TxHash: 'string | Hex',
				},
			},
		},
	},
	config: {
		maybeValue: 'T | undefined | null',
		skipTypename: true,
		enumsAsTypes: true,
		allowEnumStringTypes: true,
		omitOperationSuffix: true,
		declarationKind: 'interface',
		namingConvention: {
			enumValues: 'keep',
			typeNames: 'keep',
		},
	},
}

export default config
