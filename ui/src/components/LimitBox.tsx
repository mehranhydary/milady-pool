import styled from 'styled-components'
import { SwapVertical } from '@styled-icons/ionicons-outline/SwapVertical'
import Image from 'next/image'

const LimitBox = () => {
	return (
		<Container>
			<TopSection />
			<MiddleSection />
			<BottomSection />
		</Container>
	)
}

const TopSection = () => (
	<Top>
		<Left>
			<Label>When 1</Label>
			<CoinCapsule>
				<CoinLogo
					src={'/images/logos/eth-logo.png'}
					alt='ETH Logo'
					width={16}
					height={16}
				/>
				<CoinSymbol>ETH</CoinSymbol>
			</CoinCapsule>
			<Label>is worth</Label>
		</Left>
		<Label>
			<SwapVerticalIcon color='#fff' size={14} />
		</Label>
	</Top>
)

const MiddleSection = () => (
	<Middle>
		<StyledTextInput value={2391.77} />
		<CoinCapsule>
			<CoinLogo
				src={'/images/logos/eth-logo.png'}
				alt='ETH Logo'
				width={18}
				height={18}
			/>
			<CoinSymbol>ETH</CoinSymbol>
		</CoinCapsule>
	</Middle>
)

const BottomSection = () => (
	<Bottom>
		<IncrementBox>
			<Increment selected>Market</Increment>
			<Increment selected={false}>+1%</Increment>
			<Increment selected={false}>+5%</Increment>
			<Increment selected={false}>+10%</Increment>
		</IncrementBox>
	</Bottom>
)

export default LimitBox

const Container = styled.div`
	border: 1px solid #fff;
	padding: 16px 8px;
	height: 120px;
	width: 480px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 8px;
`
const Top = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`
const Middle = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`
const Bottom = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`
const StyledTextInput = styled.input`
	font-size: 28px;
	border: none;
	padding: 0;
	margin: 0;
	width: auto;
	height: auto;
	background-color: transparent;

	&::placeholder {
		color: lightgrey;
	}

	&:focus {
		outline: none;
	}
`
const Label = styled.div`
	font-size: 12px;
	color: #ccc;
`

const SwapVerticalIcon = styled(SwapVertical)`
	color: #ccc;
	cursor: pointer;

	&:hover {
		color: #fff;
		cursor: pointer;
	}
`
const CoinCapsule = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 4px;
`
const CoinLogo = styled(Image)``
const CoinSymbol = styled.div`
	font-size: 14px;
	color: #fff;
`
const Left = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 8px;
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
