import styled from 'styled-components'

interface Order {
	hash: string
	date: string
	completed: boolean
}

const sampleOrders: Order[] = [
	{
		hash: '0x1234567890abcdef1234567890abcdef12345678',
		date: '2022-01-01T10:15:30Z',
		completed: false,
	},
	{
		hash: '0x567890abcdef1234567890abcdef1234567890ab',
		date: '2022-01-02T11:20:35Z',
		completed: false,
	},
	{
		hash: '0x9abcdef1234567890abcdef1234567890abcdef12',
		date: '2022-01-03T12:25:40Z',
		completed: false,
	},
	{
		hash: '0xdef1234567890abcdef1234567890abcdef123456',
		date: '2022-01-04T13:30:45Z',
		completed: true,
	},
	{
		hash: '0x1111234567890abcdef1234567890abcdef123456',
		date: '2022-01-05T14:35:50Z',
		completed: false,
	},
	{
		hash: '0x222234567890abcdef1234567890abcdef123456',
		date: '2022-01-06T15:40:55Z',
		completed: true,
	},
	{
		hash: '0x33334567890abcdef1234567890abcdef12345678',
		date: '2022-01-07T16:45:00Z',
		completed: false,
	},
	{
		hash: '0x4444567890abcdef1234567890abcdef123456789',
		date: '2022-01-08T17:50:05Z',
		completed: true,
	},
	{
		hash: '0x555567890abcdef1234567890abcdef1234567890',
		date: '2022-01-09T18:55:10Z',
		completed: false,
	},
	{
		hash: '0x66667890abcdef1234567890abcdef123456789012',
		date: '2022-01-10T19:00:15Z',
		completed: true,
	},
	{
		hash: '0x7777890abcdef1234567890abcdef1234567890123',
		date: '2022-01-11T20:05:20Z',
		completed: true,
	},
	{
		hash: '0x888890abcdef1234567890abcdef12345678901234',
		date: '2022-01-12T21:10:25Z',
		completed: true,
	},
	{
		hash: '0x99990abcdef1234567890abcdef123456789012345',
		date: '2022-01-13T22:15:30Z',
		completed: true,
	},
	{
		hash: '0xaaaa0abcdef1234567890abcdef1234567890123456',
		date: '2022-01-14T23:20:35Z',
		completed: true,
	},
	{
		hash: '0xbbbb0abcdef1234567890abcdef1234567890123456',
		date: '2022-01-15T00:25:40Z',
		completed: true,
	},
]

const OrderTable = () => {
	const shortenHash = (hash: string) => {
		return `${hash.slice(0, 6)}...${hash.slice(-4)}`
	}
	return (
		<>
			<HeaderContainer>
				<Title>Milady Pool Orders</Title>
				<Subtitle>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit.
				</Subtitle>
			</HeaderContainer>
			<Table>
				<thead>
					<Tr>
						<Th>Order Hash</Th>
						<Th>Date</Th>
						<Th>Completed</Th>
					</Tr>
				</thead>
				<tbody>
					{sampleOrders.map((order) => (
						<Tr key={order.hash}>
							<Td>{shortenHash(order.hash)}</Td>
							<Td>{order.date}</Td>
							<Td>{order.completed ? '✔️' : ''}</Td>
						</Tr>
					))}
				</tbody>
			</Table>
		</>
	)
}

export default OrderTable

const HeaderContainer = styled.div`
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

const Table = styled.table`
	width: 100%;
	border-collapse: collapse;
	color: #fff; /* Ensure text is visible on black background */
	font-size: 12px; /* Reduced font size */
`

const Th = styled.th`
	border: 1px solid #444; /* Darker border for better visibility */
	padding: 8px;
	text-align: left;
	background-color: #333; /* Darker background for header */
	color: #fff; /* Ensure text is visible on dark background */
	font-size: 12px; /* Reduced font size */
`

const Td = styled.td`
	border: 1px solid #444; /* Darker border for better visibility */
	padding: 8px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 12px; /* Reduced font size */

	&:hover {
		background-color: #555; /* Highlight cell on hover */
		color: #fff; /* Ensure text is visible on hover */
	}
`

const Tr = styled.tr`
	&:nth-child(even) {
		background-color: #222; /* Darker background for even rows */
	}

	&:hover {
		background-color: #444; /* Highlight row on hover */
	}
`
