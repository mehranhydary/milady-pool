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

export type GetOrdersVariables = Exact<{ [key: string]: never; }>;


export type GetOrders = { orders: Array<{ id: string, trader: string, tickToSellAt: number, zeroForOne: boolean, tokenInput: string, inputAmount?: string | undefined, outputAmount?: string | undefined, permit2Signature: string, startTime: string, deadline: string, poolKey: { token0: string, token1: string, fee: string, tickSpacing: number, hooks: string } }> };


      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {}
};
      export default result;
    