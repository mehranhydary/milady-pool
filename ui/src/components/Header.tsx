import styled from 'styled-components'
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { LogIn } from '@styled-icons/ionicons-sharp/LogIn'
import { LogOut } from '@styled-icons/ionicons-sharp/LogOut'
import Image from 'next/image'

const Header = () => {
	const { connectors, connect } = useConnect()
	const { address } = useAccount()
	const { disconnect } = useDisconnect()
	const { data: balance } = useBalance({ address })
	const shortenAddress = (address: string) => {
		if (!address) return ''
		return `${address.slice(0, 6)}...${address.slice(-4)}`
	}

	return (
		<Container>
			{/* {address ? (
				<EthAddressContainer>
					<EthAddress>
						{shortenAddress(address)}
						{balance && (
							<Balance>
								Balance:{' '}
								{parseFloat(balance.formatted).toFixed(2)}
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
							connector.name === 'MetaMask' && connector.icon
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
			)} */}
			<Title>Milady Pool</Title>
			<Subtitle>
				A private platform where users trade crypto without disclosing
				intentions to a wider market.
			</Subtitle>
		</Container>
	)
}

export default Header

const Container = styled.header`
	display: flex;
	flex-direction: column;
	// align-items: flex-end;
	gap: 24px;
	width: 480px;
`

const Title = styled.div`
	font-size: 24px;
	text-align: center;
`
const Subtitle = styled.div`
	font-size: 16px;
	text-align: center;
	color: #ccc;
`

const EthAddressContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
`

const EthAddress = styled.div`
	background-color: #f0f0f0;
	color: #333;
	border: 1px solid #ccc;
	padding: 8px 16px;
	border-radius: 4px;
	font-size: 14px;
	text-align: center;
`

const Balance = styled.div`
	font-size: 12px;
	color: #666;
	margin-top: 4px;
`

const LogOutIcon = styled(LogOut)`
	width: 24px;
	height: 24px;
	cursor: pointer;
	color: #fff;

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
