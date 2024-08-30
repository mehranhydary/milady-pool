"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchema = void 0;
const stitch_1 = require("@graphql-tools/stitch");
const common_1 = require("./extensions/common");
const orders_1 = require("./extensions/orders");
const lodash_1 = require("lodash");
const resolvers = (0, lodash_1.merge)(orders_1.resolvers);
const getSchema = () => {
    return (0, stitch_1.stitchSchemas)({
        resolvers,
        typeDefs: [common_1.typeDefs, orders_1.typeDefs],
    });
};
exports.getSchema = getSchema;
