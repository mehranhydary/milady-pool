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
  deadline: Scalars['ISO8601Date']['input'];
  inputAmount?: InputMaybe<Scalars['String']['input']>;
  outputAmount?: InputMaybe<Scalars['String']['input']>;
  permit2Signature: Scalars['String']['input'];
  poolKey: PoolKeyInput;
  startTime: Scalars['ISO8601Date']['input'];
  tickToSellAt: Scalars['Int']['input'];
  walletAddress: Scalars['String']['input'];
  zeroForOne: Scalars['Boolean']['input'];
}

export interface Mutation {
  createOrder: Order;
}


export interface MutationcreateOrderArgs {
  input: CreateOrderInput;
}

export interface Order {
  deadline?: Maybe<Scalars['ISO8601Date']['output']>;
  inputAmount?: Maybe<Scalars['String']['output']>;
  permit2Signature?: Maybe<Scalars['String']['output']>;
  poolKey?: Maybe<PoolKey>;
  startTime?: Maybe<Scalars['ISO8601Date']['output']>;
  tickToSellAt?: Maybe<Scalars['Int']['output']>;
  walletAddress?: Maybe<Scalars['String']['output']>;
  zeroForOne?: Maybe<Scalars['Boolean']['output']>;
}

export interface PoolKey {
  fee?: Maybe<Scalars['String']['output']>;
  hooks?: Maybe<Scalars['String']['output']>;
  tickSpacing?: Maybe<Scalars['Int']['output']>;
  token0?: Maybe<Scalars['String']['output']>;
  token1?: Maybe<Scalars['String']['output']>;
}

export interface PoolKeyInput {
  fee: Scalars['String']['input'];
  hooks?: InputMaybe<Scalars['String']['input']>;
  tickSpacing: Scalars['Int']['input'];
  token0: Scalars['String']['input'];
  token1: Scalars['String']['input'];
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
  PoolKeyInput: PoolKeyInput;
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
  PoolKeyInput: PoolKeyInput;
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
  deadline?: Resolver<Maybe<ResolversTypes['ISO8601Date']>, ParentType, ContextType>;
  inputAmount?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  permit2Signature?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  poolKey?: Resolver<Maybe<ResolversTypes['PoolKey']>, ParentType, ContextType>;
  startTime?: Resolver<Maybe<ResolversTypes['ISO8601Date']>, ParentType, ContextType>;
  tickToSellAt?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  walletAddress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  zeroForOne?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PoolKeyResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['PoolKey'] = ResolversParentTypes['PoolKey']> = ResolversObject<{
  fee?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hooks?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tickSpacing?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  token0?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  token1?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
