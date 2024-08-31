import { stitchSchemas } from '@graphql-tools/stitch';
import { typeDefs as commonTypeDefs } from './extensions/common';
import { resolvers as ordersResolvers, typeDefs as ordersTypeDefs, } from './extensions/orders';
import { merge } from 'lodash';
const resolvers = merge(ordersResolvers);
export const getSchema = () => {
    return stitchSchemas({
        resolvers,
        typeDefs: [commonTypeDefs, ordersTypeDefs],
    });
};
