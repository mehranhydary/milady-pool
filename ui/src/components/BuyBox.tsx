import styled from 'styled-components'
import { SwapVertical } from '@styled-icons/ionicons-outline/SwapVertical'
import Image from 'next/image'

const BuyBox = () => {
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
		<Label>Buy</Label>
	</Top>
)

const MiddleSection = () => (
	<Middle>
		<StyledTextInput value={556588} />
		<CoinDropdownSelector>
			<CoinLogoForSelector
				src={'/images/logos/usdc-logo.png'}
				alt='USDC Logo'
				width={24}
				height={24}
			/>
			<CoinSymbolForSelector>USDC</CoinSymbolForSelector>
		</CoinDropdownSelector>
	</Middle>
)

const BottomSection = () => (
	<Bottom>
		<IncrementBox></IncrementBox>
	</Bottom>
)

export default BuyBox

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

const IncrementBox = styled.div`
	display: flex;
	justify-content: space-between;
	gap: 8px;
	align-items: center;
`

const CoinDropdownSelector = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 4px;
	min-width: 72px;
	background-color: #333;
	border-radius: 24px;
	padding: 4px;

	&:hover {
		background-color: #444;
		cursor: pointer;
	}
`
const CoinLogoForSelector = styled(Image)``
const CoinSymbolForSelector = styled.div`
	font-size: 14px;
	color: #fff;
`
