import { CorsOptions } from 'cors'
import { serverConfig } from './server'
import { isLocalhost } from '../utils/network'

export const getOriginResponse: CorsOptions['origin'] = (origin, callback) => {
	if (
		!origin ||
		serverConfig.allowedOrigins.includes(origin) ||
		isLocalhost(origin)
	)
		callback(null, origin)
	else {
		console.info(`Blocking CORS request from: ${origin}`, { flow: 'CORS' })
		callback(null, 'arena.exchange')
	}
}
