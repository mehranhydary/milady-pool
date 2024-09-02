import 'dotenv/config'
import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
	overwrite: true,
	generates: {
		'src/types/queries.ts': {
			schema: 'http://localhost:8081/graphql',
			plugins: [
				'typescript',
				'typescript-operations',
				'fragment-matcher',
			],
		},
		'src/types/resolvers.ts': {
			plugins: [
				'@graphql-codegen/typescript',
				'@graphql-codegen/typescript-resolvers',
			],
			schema: ['./core/graphql/extensions/*/**'],
			config: {
				contextType: './core/graphql/schema#GraphqlContext',
				rootValueType: './core/graphql/schema#RootValue',
				mappers: {
					Decimal: './core/graphql/schema#Decimal',
				},
				useIndexSignature: true,
				printFieldsOnNewLines: true,
				scalars: {
					ISO8601Date: 'string | Date',
					BigInt: {
						input: 'bigint',
						output: 'bigint | string | Decimal',
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
