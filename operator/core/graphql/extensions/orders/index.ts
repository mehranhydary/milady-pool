import { default as gql } from 'graphql-tag'

export const typeDefs = gql`
	extend type Query {
		orders: [Order]
	}

	extend type Mutation {
		createOrder(input: CreateOrderInput): Order
	}
`

interface OrdersResolvers {
	Query: {
		orders: () => Promise<any[]>
	}
	Mutation: {
		createOrder: (_: any, { input }: { input: any }) => Promise<any>
	}
}

export const resolvers: OrdersResolvers = {
	Query: {
		orders: async () => {
			return [
				{
					id: '1',
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					status: 'CREATED',
					amount: 100,
				},
			]
		},
	},
	Mutation: {
		createOrder: async (_: any, { input }: { input: any }) => {
			return {
				id: '1',
				...input,
			}
		},
	},
}
