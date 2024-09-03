import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { Decimal, GraphqlContext, RootValue } from './core/graphql/schema';
export type Maybe<T> = T | undefined | null;
export type InputMaybe<T> = T | undefined | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  ISO8601Date: { input: string | Date; output: string | Date; }
}

export interface CreateOrderInput {
  deadline?: InputMaybe<Scalars['ISO8601Date']['input']>;
  fee: Scalars['String']['input'];
  hooks?: InputMaybe<Scalars['String']['input']>;
  inputAmount?: InputMaybe<Scalars['String']['input']>;
  outputAmount?: InputMaybe<Scalars['String']['input']>;
  permit2Signature: Scalars['String']['input'];
  startTime?: InputMaybe<Scalars['ISO8601Date']['input']>;
  tickSpacing: Scalars['Int']['input'];
  tickToSellAt?: InputMaybe<Scalars['Int']['input']>;
  tokenA: Scalars['String']['input'];
  tokenB: Scalars['String']['input'];
  tokenInput: Scalars['String']['input'];
  trader: Scalars['String']['input'];
}

export interface Mutation {
  createOrder: Order;
}


export interface MutationcreateOrderArgs {
  input: CreateOrderInput;
}

export interface Order {
  deadline: Scalars['ISO8601Date']['output'];
  id: Scalars['String']['output'];
  inputAmount?: Maybe<Scalars['String']['output']>;
  outputAmount?: Maybe<Scalars['String']['output']>;
  permit2Signature: Scalars['String']['output'];
  poolKey: PoolKey;
  startTime: Scalars['ISO8601Date']['output'];
  tickToSellAt: Scalars['Int']['output'];
  tokenInput: Scalars['String']['output'];
  trader: Scalars['String']['output'];
  zeroForOne: Scalars['Boolean']['output'];
}

export interface PoolKey {
  fee: Scalars['String']['output'];
  hooks: Scalars['String']['output'];
  id: Scalars['String']['output'];
  tickSpacing: Scalars['Int']['output'];
  token0: Scalars['String']['output'];
  token1: Scalars['String']['output'];
}

export interface Query {
  orders: Array<Order>;
}

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateOrderInput: CreateOrderInput;
  ISO8601Date: ResolverTypeWrapper<Scalars['ISO8601Date']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<RootValue>;
  Order: ResolverTypeWrapper<Order>;
  PoolKey: ResolverTypeWrapper<PoolKey>;
  Query: ResolverTypeWrapper<RootValue>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  CreateOrderInput: CreateOrderInput;
  ISO8601Date: Scalars['ISO8601Date']['output'];
  Int: Scalars['Int']['output'];
  Mutation: RootValue;
  Order: Order;
  PoolKey: PoolKey;
  Query: RootValue;
  String: Scalars['String']['output'];
}>;

export interface ISO8601DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ISO8601Date'], any> {
  name: 'ISO8601Date';
}

export type MutationResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createOrder?: Resolver<ResolversTypes['Order'], ParentType, ContextType, RequireFields<MutationcreateOrderArgs, 'input'>>;
}>;

export type OrderResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['Order'] = ResolversParentTypes['Order']> = ResolversObject<{
  deadline?: Resolver<ResolversTypes['ISO8601Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  inputAmount?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  outputAmount?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  permit2Signature?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  poolKey?: Resolver<ResolversTypes['PoolKey'], ParentType, ContextType>;
  startTime?: Resolver<ResolversTypes['ISO8601Date'], ParentType, ContextType>;
  tickToSellAt?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  tokenInput?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trader?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  zeroForOne?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PoolKeyResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['PoolKey'] = ResolversParentTypes['PoolKey']> = ResolversObject<{
  fee?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hooks?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tickSpacing?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  token0?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  token1?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  orders?: Resolver<Array<ResolversTypes['Order']>, ParentType, ContextType>;
}>;

export type Resolvers<ContextType = GraphqlContext> = ResolversObject<{
  ISO8601Date?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Order?: OrderResolvers<ContextType>;
  PoolKey?: PoolKeyResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
}>;

