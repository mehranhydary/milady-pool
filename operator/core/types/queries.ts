export type Maybe<T> = T | undefined | null;
export type InputMaybe<T> = T | undefined | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  ISO8601Date: { input: any; output: any; }
}

export interface CreateOrderInput {
  deadline?: InputMaybe<Scalars['ISO8601Date']['input']>;
  fee: Scalars['String']['input'];
  hooks?: InputMaybe<Scalars['String']['input']>;
  inputAmount?: InputMaybe<Scalars['String']['input']>;
  outputAmount?: InputMaybe<Scalars['String']['input']>;
  permit2Signature: Scalars['String']['input'];
  startTime?: InputMaybe<Scalars['ISO8601Date']['input']>;
  tickSpacing: Scalars['String']['input'];
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
  tickSpacing: Scalars['String']['output'];
  token0: Scalars['String']['output'];
  token1: Scalars['String']['output'];
}

export interface Query {
  orders: Array<Order>;
}


      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {}
};
      export default result;
    