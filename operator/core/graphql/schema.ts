import { GraphQLSchema } from 'graphql'
import { stitchSchemas } from '@graphql-tools/stitch'

import { typeDefs as commonTypeDefs } from './extensions/common'
import {
	resolvers as ordersResolvers,
	typeDefs as ordersTypeDefs,
} from './extensions/orders'

import { merge } from 'lodash'

const resolvers = merge(ordersResolvers)

export const getSchema = (): GraphQLSchema => {
	return stitchSchemas<GraphqlContext>({
		resolvers,
		typeDefs: [commonTypeDefs, ordersTypeDefs],
	})
}

export interface GraphqlContext {
	requestId: string

	// TODO: Hook this up once a database is created / Prisma is added
	// getDb: () => DB
	// user: Maybe<Express.User>
}
