"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const schema_1 = require("./core/graphql/schema");
const server_2 = require("./server");
const server_3 = require("./config/server");
const body_parser_1 = __importDefault(require("body-parser"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const schema = (0, schema_1.getSchema)();
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new server_1.ApolloServer({
    schema,
    introspection: true,
    plugins: [
        (0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer: server_2.httpServer }),
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        console.log('Draining websocket server before shutdown');
                        try {
                            // TODO: Handle any subscriptions here
                        }
                        catch (e) {
                            console.error('Error draining websocket server / cancelling any subscriptions', e);
                        }
                    },
                };
            },
        },
    ],
});
server_2.app.use(body_parser_1.default.json());
server_2.app.use((0, compression_1.default)());
server_2.app.use((0, cookie_parser_1.default)());
server.start().then(() => { });
server_2.httpServer.listen(server_3.serverConfig.port, () => {
    console.log(`Milady Pool AVS API running on port: ${server_3.serverConfig.port}\n`);
});
