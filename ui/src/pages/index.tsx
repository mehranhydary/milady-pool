import Head from 'next/head'
import styled from 'styled-components'
import Header from '@/components/Header'
import LimitBox from '@/components/LimitBox'
import SellBox from '@/components/SellBox'
import BuyBox from '@/components/BuyBox'
import Actions from '@/components/Actions'
import OrderTable from '@/components/OrderTable'
import { useOrders } from '@/hooks/useOrders'
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { LogOut } from '@styled-icons/ionicons-sharp/LogOut'
import Image from 'next/image'

const Home = () => {
	const { orders, createOrder } = useOrders()
	const { connectors, connect } = useConnect()
	const { address } = useAccount()
	const { disconnect } = useDisconnect()
	const { data: balance } = useBalance({ address })
	const shortenAddress = (address: string) => {
		if (!address) return ''
		return `${address.slice(0, 6)}...${address.slice(-4)}`
	}

	return (
		<div>
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
			</Head>
			<Container>
				<Content>
					<SwapBox>
						<Header />
						<LimitBox />
						<SellBox />
						<BuyBox />
						<Actions createOrder={createOrder} />
						{address ? (
							<EthAddressContainer>
								<EthAddress>
									{shortenAddress(address)}
									{balance && (
										<Balance>
											Balance:{' '}
											{parseFloat(
												balance.formatted
											).toFixed(2)}
											{balance.symbol}
										</Balance>
									)}
								</EthAddress>
								<LogOutIcon onClick={() => disconnect()} />
							</EthAddressContainer>
						) : (
							connectors
								.filter(
									(connector) =>
										connector.name === 'MetaMask' &&
										connector.icon
								)
								.map((connector) => (
									<ActionButton
										key={connector.uid}
										onClick={() => connect({ connector })}
									>
										{connector.icon && (
											<Image
												src={connector.icon}
												width={20}
												height={20}
												alt={`${connector.name} icon`}
											/>
										)}
										{connector.name}
									</ActionButton>
								))
						)}
					</SwapBox>
					<OrderTable orders={orders} />
				</Content>
			</Container>
		</div>
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
	gap: 4px;
`
const Content = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	// align-items: center;
	gap: 24px;
	width: 100%;
`

const EthAddressContainer = styled.div`
	display: flex;
	align-items: left;
	justify-content: space-between;
	background-color: #f0f0f0;
	border-radius: 4px;
	color: #333;
	cursor: pointer;
	border: 1px solid #ccc;
`

const EthAddress = styled.div`
	padding: 8px;
	border-radius: 4px;
	font-size: 14px;
	text-align: left;
`

const Balance = styled.div`
	font-size: 12px;
	color: #666;
	margin-top: 4px;
`

const LogOutIcon = styled(LogOut)`
	width: 24px;
	height: 24px;
	color: #666;
	&:hover {
		color: #0070f3;
	}
`

const ActionButton = styled.button<{ disabled?: boolean }>`
	align-items: center;
	background-color: ${({ disabled }) => (disabled ? '#ccc' : '#0070f3')};
	border: none;
	border-radius: 4px;
	color: ${({ disabled }) => (disabled ? '#666' : 'white')};
	cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
	display: flex;
	font-size: 16px;
	gap: 8px;
	justify-content: center;
	padding: 8px 16px;
	width: 120px;

	&:hover {
		background-color: ${({ disabled }) => (disabled ? '#ccc' : '#005bb5')};
	}
`
