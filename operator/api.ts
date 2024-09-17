import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { expressMiddleware } from '@apollo/server/express4'
import { getSchema, GraphqlContext } from './core/graphql/schema'
import { app, httpServer } from './server'
import { serverConfig } from './config/server'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import compression from 'compression'
import { v4 } from 'uuid'
import { getDb } from './lib/db/getDb'
import { useServer } from 'graphql-ws/lib/use/ws'
import { WebSocketServer } from 'ws'
import { getOriginResponse } from './config/cors'
import { monitorNewTicks } from './lib/web3'

const schema = getSchema()
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.

// Creating the WebSocket server
const wsServer = new WebSocketServer({
	// This is the `httpServer` we created in a previous step.
	server: httpServer,
	// Pass a different path here if app.use
	// serves expressMiddleware at a different path
	path: '/graphql',
})

const serverCleanup = useServer(
	{
		schema,
		context: (ctx, msg, args): GraphqlContext => {
			const req = ctx.extra.request
			const requestId = msg.id || v4()
			return {
				getDb,
				requestId,
			}
		},
	},
	wsServer
)

const server = new ApolloServer<GraphqlContext>({
	schema,
	introspection: true,
	plugins: [
		ApolloServerPluginDrainHttpServer({ httpServer }),
		{
			async serverWillStart() {
				return {
					async drainServer() {
						console.log('Draining websocket server before shutdown')

						try {
							// TODO: Handle any subscriptions here
						} catch (e: any) {
							console.error(
								'Error draining websocket server / cancelling any subscriptions',
								e
							)
						}

						await serverCleanup.dispose()
					},
				}
			},
		},
	],
})

app.use(bodyParser.json())
app.use(cors({ origin: getOriginResponse, credentials: true }))
app.use(compression())
app.use(cookieParser())

server.start().then(() => {
	app.use(
		expressMiddleware(server, {
			context: async ({ req, res }) => {
				// TODO: See if req.id exists later
				const requestId = v4()
				// TODO: There is no user rn

				return {
					requestId,
					getDb,
				}
			},
		})
	)
})

httpServer.listen(serverConfig.port, () => {
	console.log(
		`Milady Pool AVS GraphQL API running on port: ${serverConfig.port}\n`
	)
})

monitorNewTicks()
	.then(() => {
		console.log(
			"For new ticks, goes through all orders and checks if they're valid for the new price"
		)
		console.log(
			'Monitoring new ticks on MiladyPool deployed at http://127.0.0.1:8545'
		)
	})
	.catch((error: any) => {
		console.error('Error monitoring new ticks', error)
		process.exit(1)
	})
