import axios from 'axios'

import Agent from 'agentkeepalive'

export * from 'axios'

export const globalHttpsKeepAliveAgent = new Agent.HttpsAgent({
	keepAlive: true,
	maxSockets: 15,
	maxFreeSockets: 15,
	timeout: 60000, // active socket keepalive for 60 seconds
	freeSocketTimeout: 30000, // free socket keepalive for 30 seconds
})
export const globalHttpKeepAliveAgent = new Agent({
	keepAlive: true,
	maxSockets: 15,
	maxFreeSockets: 15,
	timeout: 60000, // active socket keepalive for 60 seconds
	freeSocketTimeout: 30000, // free socket keepalive for 30 seconds
})

export const axiosInstance = axios.create({
	//keepAlive pools and reuses TCP connections, so it's faster
	httpAgent: globalHttpKeepAliveAgent,
	httpsAgent: globalHttpsKeepAliveAgent,
	//follow up to 10 HTTP 3xx redirects
	maxRedirects: 10,

	//cap the maximum content length we'll accept to 50MBs, just in case
	maxContentLength: 50 * 1000 * 1000,
})

axiosInstance.interceptors.request.use((request) => {
	console.log(`[${request.method?.toUpperCase()}]: ${request.url}`)
	return request
})

export default axiosInstance
