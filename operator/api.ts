import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { getSchema, GraphqlContext } from './core/graphql/schema'
import { app, httpServer } from './server'
import { serverConfig } from './config/server'
import bodyParser from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'

const schema = getSchema()
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
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
					},
				}
			},
		},
	],
})

app.use(bodyParser.json())
app.use(compression())
app.use(cookieParser())

server.start().then(() => {})

httpServer.listen(serverConfig.port, () => {
	console.log(`Milady Pool AVS API running on port: ${serverConfig.port}\n`)
})
