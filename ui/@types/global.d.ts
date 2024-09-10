import { PublicEnv } from '@/config'
declare global {
	const MozWebSocket: any
	const WebSocket: any

	interface Window {
		ethereum: any
		__APOLLO_STATE__: any
		publicEnv: PublicEnv
		MozWebSocket?: any
		WebSocket?: any
	}
}
