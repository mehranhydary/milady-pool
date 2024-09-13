import { registerOperator } from '../lib/web3'

registerOperator()
	.then(() => {
		console.log('Operator registered')
		process.exit(0)
	})
	.catch((error: any) => {
		console.error('Error registering operator', error)
		process.exit(1)
	})
