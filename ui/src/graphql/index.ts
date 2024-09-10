import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import {
	HttpLink,
	ApolloLink,
	InMemoryCache,
	ApolloClient,
	ApolloCache,
	NormalizedCacheObject,
} from '@apollo/client'
import { createClient } from 'graphql-ws'
import { getWebSocket } from './webSocket'

let serverClient: ApolloClient<any>
let browserClient: ApolloClient<any>
let wsLink: Maybe<GraphQLWsLink> = null

export const getWsClient = () => {
	if (wsLink) return wsLink

	wsLink = new GraphQLWsLink(
		createClient({
			url: 'http://localhost:8081/graphql',
			webSocketImpl: getWebSocket(),
		})
	)

	return wsLink
}

export const getGraphQLClient = <TShape extends NormalizedCacheObject>(
	providedCache?: ApolloCache<TShape>
) => {
	const cache =
		providedCache ||
		new InMemoryCache({
			typePolicies: {
				Query: {
					fields: {
						feed: {
							keyArgs: false,
							merge(
								existing,
								incoming,
								// @ts-expect-error `offset` throwing an error
								{ args: { offset = 0 } }
							) {
								const merged = existing ? existing.slice(0) : []
								for (let i = 0; i < incoming.length; ++i) {
									merged[offset + i] = incoming[i]
								}
								return merged
							},
						},
					},
				},
			},
		})

	if (typeof document === 'undefined') {
		const operatorServer = new HttpLink({
			// TODO: Put this in the .env file
			uri: 'http://localhost:8081/graphql',
			credentials: 'include',
		})

		operatorServer.setOnError((error: any) => {
			console.error('Operator server error', error)
		})

		if (serverClient) return serverClient

		serverClient = new ApolloClient({
			ssrMode: true,
			cache,
			link: ApolloLink.split(
				({ query }) => {
					const definition = getMainDefinition(query)
					return (
						definition.kind === 'OperationDefinition' &&
						definition.operation === 'subscription'
					)
				},
				getWsClient(),
				operatorServer
			),
		})

		return serverClient
	} else {
		if (browserClient) return browserClient

		const operatorServer = new HttpLink({
			uri: 'http://localhost:8081/graphql',
			credentials: 'include',
		})

		operatorServer.setOnError((error: any) => {
			console.error('Operator server error', error)
		})

		if (window.__APOLLO_STATE__) {
			cache.restore(window.__APOLLO_STATE__)
		}

		browserClient = new ApolloClient({
			cache,
			link: ApolloLink.split(
				({ query }) => {
					const definition = getMainDefinition(query)
					return (
						definition.kind === 'OperationDefinition' &&
						definition.operation === 'subscription'
					)
				},
				getWsClient(),
				operatorServer
			),
		})

		return browserClient
	}
}
