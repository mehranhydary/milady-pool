import styled from 'styled-components'

const Header = () => {
	return (
		<Container>
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
