import { ThunkMiddleware } from '@reduxjs/toolkit/dist'
import { AnyAction, combineReducers, configureStore } from '@reduxjs/toolkit'
import {
	persistStore,
	persistReducer,
	type PersistConfig,
	Persistor,
} from 'redux-persist'
import { PersistPartial } from 'redux-persist/es/persistReducer'
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore'
import { PersistedRootState } from './types'
import { ThunkMiddlewareFor } from '@reduxjs/toolkit/dist/getDefaultMiddleware'
import { ordersReducer } from './orders/orders.reducer'
import { thunk } from 'redux-thunk'

export type Store = ToolkitStore<
	PersistedRootState & PersistPartial,
	AnyAction,
	[ThunkMiddleware<PersistedRootState, AnyAction>]
>

let redux: { store: Store; persistor: Persistor } | null = null

export const serverReduxStore = () => {
	if (typeof window !== 'undefined') {
		throw new Error('serverReduxStore should only be called on the server')
	}
	return getReusableStore().store
}

export const getReusableStore = (
	preloadedState?: Maybe<PersistedRootState>
) => {
	if (redux) {
		return redux
	}
	redux = getStore(preloadedState)
	return redux
}

export const getStore = (preloadedState?: Maybe<PersistedRootState>) => {
	const indexDbPersistConfig: PersistConfig<PersistedRootState> = {
		key: 'root',
		storage: require('redux-persist/lib/storage').default,
	}

	const rootReducer = combineReducers<PersistedRootState>({
		orders: ordersReducer,
	})

	const persistedReducer = persistReducer(indexDbPersistConfig, rootReducer)

	const store = configureStore<
		PersistedRootState & PersistPartial,
		AnyAction,
		[ThunkMiddlewareFor<PersistedRootState>]
	>({
		reducer: persistedReducer,
		devTools: true,
		middleware: [thunk],
		preloadedState: preloadedState ?? undefined,
	})

	const persistor = persistStore(store)

	redux = { persistor, store }

	return redux
}

export type AppDispatch = Store['dispatch']
export type RootState = ReturnType<Store['getState']>
