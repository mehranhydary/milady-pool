import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider as ReduxProvider } from 'react-redux'
import { config } from '@/utils/wagmi'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { getReusableStore } from '@/redux/store'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<ReduxProvider store={getReusableStore().store}>
					<Component {...pageProps} />
					<ToastContainer
						position='bottom-center'
						autoClose={5000}
						hideProgressBar={false}
						newestOnTop={false}
						closeOnClick
						rtl={false}
						pauseOnFocusLoss
						draggable
						pauseOnHover
						theme='dark'
					/>
				</ReduxProvider>
			</QueryClientProvider>
		</WagmiProvider>
	)
}
