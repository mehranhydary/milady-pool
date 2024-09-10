declare type Maybe<T> = T | null

declare type EthereumAddress = `0x${string}`
declare type Hex = `0x${string}`

declare type Nominal<T, Name extends string> = T & {
	[Symbol.species]: Name
}

declare type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

declare type Prettify<T> = {
	[K in keyof T]: T[K]
} & {}
