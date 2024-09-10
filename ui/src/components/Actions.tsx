import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'

const Actions = ({ createOrder }: { createOrder: () => Promise<void> }) => {
	const [selectedIncrement, setSelectedIncrement] = useState('1 day')

	const handleIncrementClick = (increment: string) => {
		setSelectedIncrement(increment)
	}
	const { connectors, connect } = useConnect()
	const { address } = useAccount()
	const { disconnect } = useDisconnect()
	const { data: balance } = useBalance({ address })

	const onCreateOrderClick = async () => {
		console.log('Create order button clicked')
		await createOrder()
		toast.success('Order created')
		// Add further logic to handle order creation here
	}

	const shortenAddress = (address: string) => {
		if (!address) return ''
		return `${address.slice(0, 6)}...${address.slice(-4)}`
	}
	return (
		<Container>
			<Top>
				<Label>Expiry</Label>
				<IncrementBox>
					<Increment
						selected={selectedIncrement === '1 day'}
						onClick={() => handleIncrementClick('1 day')}
					>
						1 day
					</Increment>
					<Increment
						selected={selectedIncrement === '1 week'}
						onClick={() => handleIncrementClick('1 week')}
					>
						1 week
					</Increment>
					<Increment
						selected={selectedIncrement === '1 month'}
						onClick={() => handleIncrementClick('1 month')}
					>
						1 month
					</Increment>
					<Increment
						selected={selectedIncrement === '1 year'}
						onClick={() => handleIncrementClick('1 year')}
					>
						1 year
					</Increment>
				</IncrementBox>
			</Top>
			<ButtonContainer>
				{address ? (
					<EthAddressContainer>
						<EthAddress>
							{shortenAddress(address)}
							{balance && (
								<Balance>
									Balance: {balance.formatted}{' '}
									{balance.symbol}
								</Balance>
							)}
						</EthAddress>
						<ActionButton onClick={() => disconnect()}>
							Disconnect
						</ActionButton>
					</EthAddressContainer>
				) : (
					connectors.map((connector) => (
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

				<ActionButton onClick={onCreateOrderClick}>
					Create order
				</ActionButton>
			</ButtonContainer>
		</Container>
	)
}

export default Actions

const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	gap: 24px;
`
const Label = styled.div`
	font-size: 12px;
	color: #ccc;
`

const Top = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	padding: 0 16px;
`

const ActionButton = styled.button<{ disabled?: boolean }>`
	background-color: ${({ disabled }) => (disabled ? '#ccc' : '#0070f3')};
	color: ${({ disabled }) => (disabled ? '#666' : 'white')};
	border: none;
	padding: 8px 16px;
	border-radius: 4px;
	font-size: 16px;
	cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
	align-items: center;
	display: flex;
	justify-content: center;
	gap: 8px;

	&:hover {
		background-color: ${({ disabled }) => (disabled ? '#ccc' : '#005bb5')};
	}
`

const IncrementBox = styled.div`
	display: flex;
	justify-content: space-between;
	gap: 8px;
	align-items: center;
`
const Increment = styled.div<{ selected?: boolean }>`
	height: 24px;
	width: 64px;
	border: 1px solid ${({ selected }) => (selected ? '#000' : '#fff')};
	font-size: 12px;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: ${({ selected }) =>
		selected ? '#f0f0f0' : 'transparent'};
	color: ${({ selected }) => (selected ? '#000' : '#fff')};
	cursor: pointer;

	&:hover {
		background-color: ${({ selected }) =>
			selected ? '#e0e0e0' : '#f0f0f0'};
		color: ${({ selected }) => (selected ? '#000' : '#333')};
	}
`

const ButtonContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	gap: 8px;
`

const EthAddressContainer = styled.div`
	display: flex;
	align-items: center;
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
	word-break: break-all;
`

const Balance = styled.div`
	font-size: 12px;
	color: #666;
	margin-top: 4px;
`
