import { GraphQLScalarType, Kind } from 'graphql'
import moment from 'moment'

export const dateScalar = new GraphQLScalarType({
	name: 'ISO8601Date',
	description: 'Date custom scalar type',
	serialize(value) {
		const date = moment(value as any)
		if (!date.isValid())
			throw Error(
				'GraphQL Date Scalar serializer expected a `Date` object'
			)
		return date.toISOString()
	},
	parseValue(value) {
		const date = moment(value as any)
		// Convert incoming integer to Date
		if (!date.isValid())
			throw Error(
				'GraphQL Date Scalar parser expected a moment like `string`'
			)

		return date.toDate()
	},
	parseLiteral(ast) {
		if (ast.kind === Kind.INT) {
			// Convert hard-coded AST string to integer and then to Date
			return new Date(parseInt(ast.value, 10))
		} else if (ast.kind === Kind.STRING) {
			return moment(ast.value as string).toDate()
		}
		// Invalid hard-coded value (not an integer)
		return null
	},
})
