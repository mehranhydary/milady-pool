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


      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {}
};
      export default result;
    