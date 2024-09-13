import { GraphQLSchema } from 'graphql'
import { stitchSchemas } from '@graphql-tools/stitch'
import { typeDefs as commonTypeDefs } from './extensions/common'
import {
	resolvers as ordersResolvers,
	typeDefs as ordersTypeDefs,
} from './extensions/orders'
import pkg from 'lodash'
import { dateScalar } from './scalars'
import { DB } from '../../lib/db/model'
const { merge } = pkg
import type { Mutation, Query, Resolvers } from '../types/resolvers'

const resolvers: Resolvers = merge(
	{
		ISO8601Date: dateScalar,
	},
	ordersResolvers
)

export const getSchema = (): GraphQLSchema => {
	return stitchSchemas<GraphqlContext>({
		resolvers,
		typeDefs: [commonTypeDefs, ordersTypeDefs],
	})
}

export interface GraphqlContext {
	requestId: string
	getDb: () => DB

	// TODO: Hook this up once a database is created / Prisma is added
	// user: Maybe<Express.User>
}

export type RootValue = {
	query: Query
	mutation: Mutation
}
