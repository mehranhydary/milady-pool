import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider as ReduxProvider } from 'react-redux'
import { getReusableStore } from '@/redux/store'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
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
		</>
	)
}
