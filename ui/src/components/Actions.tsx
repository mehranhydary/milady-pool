import Image from 'next/image'
import { useState } from 'react'

import styled from 'styled-components'

const Actions = ({ createOrder }: { createOrder: () => Promise<void> }) => {
	const [selectedIncrement, setSelectedIncrement] = useState('1 day')

	const handleIncrementClick = (increment: string) => {
		setSelectedIncrement(increment)
	}

	const onCreateOrderClick = async () => {
		await createOrder()
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
