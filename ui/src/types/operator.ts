export type Maybe<T> = T | undefined;
export type InputMaybe<T> = T | undefined;
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
  ISO8601Date: { input: string; output: string; }
}

export interface CreateOrderInput {
  amountSpecified: Scalars['String']['input'];
  deadline?: InputMaybe<Scalars['ISO8601Date']['input']>;
  fee: Scalars['String']['input'];
  hooks?: InputMaybe<Scalars['String']['input']>;
  orderSignature: Scalars['String']['input'];
  permit2Deadline: Scalars['ISO8601Date']['input'];
  permit2Nonce: Scalars['String']['input'];
  permit2Signature: Scalars['String']['input'];
  startTime?: InputMaybe<Scalars['ISO8601Date']['input']>;
  tickSpacing: Scalars['String']['input'];
  tickToSellAt?: InputMaybe<Scalars['String']['input']>;
  tokenA: Scalars['String']['input'];
  tokenB: Scalars['String']['input'];
  trader: Scalars['String']['input'];
  zeroForOne: Scalars['Boolean']['input'];
}

export type CreateOrderVariables = Exact<{
  input: CreateOrderInput;
}>;


export type CreateOrder = { createOrder: { trader: string, tickToSellAt: string, zeroForOne: boolean, amountSpecified: string, startTime: string, deadline: string, poolKey: { token0: string, token1: string, fee: string, tickSpacing: string, hooks: string } } };

export type GetOrdersVariables = Exact<{ [key: string]: never; }>;


export type GetOrders = { orders: Array<{ id: string, trader: string, tickToSellAt: string, zeroForOne: boolean, amountSpecified: string, permit2Signature: string, startTime: string, deadline: string, poolKey: { token0: string, token1: string, fee: string, tickSpacing: string, hooks: string } }> };


      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {}
};
      export default result;
    