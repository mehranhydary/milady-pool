const RE_LOCALHOST = /^http\:\/\/localhost(\:\d*)?$/
const RE_LOCALHOST_IPV4 =
	/^http:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(\:\d*)?$/

export function isLocalhost(value: string | null | undefined) {
	if (!value || typeof value !== 'string') {
		return false
	}
	return (
		RE_LOCALHOST.test(value) ||
		// IPv6 localhost address:
		value === '[::1]' ||
		RE_LOCALHOST_IPV4.test(value)
	)
}
