import { WebSocket as WebSocketImport } from 'ws'
interface WebSocketFactory {
	new (
		url: string | URL,
		protocols?: string | string[] | undefined
	): WebSocket
	prototype: WebSocket
	readonly CLOSED: number
	readonly CLOSING: number
	readonly CONNECTING: number
	readonly OPEN: number
}

export const getWebSocket = (): WebSocketFactory => {
	var ws = undefined
	if (typeof WebSocket !== 'undefined') {
		ws = WebSocket
	} else if (typeof MozWebSocket !== 'undefined') {
		ws = MozWebSocket
	} else if (
		typeof global !== 'undefined' &&
		typeof global.WebSocket !== 'undefined'
	) {
		ws = global.WebSocket
	} else if (
		typeof global !== 'undefined' &&
		// @ts-expect-error: MozWebSocket is not defined on global
		typeof global.MozWebSocket !== 'undefined'
	) {
		// @ts-expect-error: MozWebSocket is not defined on global
		ws = global.MozWebSocket
	} else if (
		typeof window !== 'undefined' &&
		typeof window.WebSocket !== 'undefined'
	) {
		ws = window.WebSocket
	} else if (
		typeof window !== 'undefined' &&
		typeof window.MozWebSocket !== 'undefined'
	) {
		ws = window.MozWebSocket
	} else {
		ws = WebSocketImport
	}
	return ws
}
