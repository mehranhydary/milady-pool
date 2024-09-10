import { PersistPartial } from 'redux-persist/es/persistReducer'
import { OrdersState } from './orders/orders.types'

export interface RawRootState {
	orders: OrdersState
}

type RootStateWithCombinedStorage<TRoot, Components> = {
	[K in keyof TRoot]: K extends Components
		? TRoot[K] & PersistPartial
		: TRoot[K]
}

export type PartialPersistedRootState = PersistPartial

export type PersistedRootState = RawRootState

export type ReduxSerializied<T> = T extends bigint | Date
	? SerializePrimitive<T>
	: T extends object
		? {
				[K in keyof T]: T[K] extends bigint | Date
					? SerializePrimitive<T[K]>
					: T[K] extends Maybe<bigint>
						? Maybe<string>
						: T[K] extends bigint | undefined
							? string | undefined
							: T[K] extends bigint | undefined | null
								? string | undefined | null
								: T[K] extends Maybe<Date>
									? Maybe<number>
									: T[K] extends Date | undefined
										? number | undefined
										: T[K] extends Date | undefined | null
											? number | undefined | null
											: T[K] extends object
												? ReduxSerializied<T[K]>
												: T[K]
			}
		: T

type SerializePrimitive<T extends bigint | Date> = T extends bigint
	? string
	: T extends Date
		? number
		: T
