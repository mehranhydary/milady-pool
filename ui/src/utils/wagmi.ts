import { http, createConfig } from 'wagmi'
import { base, mainnet } from 'wagmi/chains'
import { injected, metaMask } from 'wagmi/connectors'

// TODO: Add your private networks
export const config = createConfig({
	chains: [base, mainnet],
	connectors: [
		// injected(),
		metaMask(),
	],
	transports: {
		[mainnet.id]: http(),
		[base.id]: http(),
	},
})
