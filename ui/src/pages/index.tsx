import Head from 'next/head'
import styled from 'styled-components'
import Header from '@/components/Header'
import LimitBox from '@/components/LimitBox'
import SellBox from '@/components/SellBox'
import BuyBox from '@/components/BuyBox'
import Actions from '@/components/Actions'
import OrderTable from '@/components/OrderTable'
import { useOrders } from '@/hooks/useOrders'

const Home = () => {
	const { orders, createOrder } = useOrders()
	return (
		<>
			<Head>
				<title>Milady Pool</title>
				<meta
					name='description'
					content='A private platform where users trade crypto without disclosing intentions to a wider market.'
				/>
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Container>
				<Header />
				<SwapBox>
					<LimitBox />
					<SellBox />
					<BuyBox />
				</SwapBox>
				<Actions createOrder={createOrder} />
				<OrderTable orders={orders} />
			</Container>
		</>
	)
}

export default Home

const Container = styled.div`
	display: flex;
	flex-direction: column;
	height: 100vh;
	gap: 24px;
	width: 480px;
	margin: 64px auto;
`

const SwapBox = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 4px;
`
