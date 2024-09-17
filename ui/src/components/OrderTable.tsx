import styled from 'styled-components'
import { useState } from 'react'

const OrderTable = ({ orders }: { orders: any[] }) => {
	const [currentPage, setCurrentPage] = useState(1)
	const ordersPerPage = orders.length > 10 ? 10 : orders.length

	const indexOfLastOrder = currentPage * ordersPerPage
	const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
	const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder)

	const paginate = (pageNumber: number) => {
		if (pageNumber < 1) {
			pageNumber = 1
		} else if (pageNumber > totalPages) {
			pageNumber = totalPages
		}
		setCurrentPage(pageNumber)
	}

	const shortenHash = (hash: string) => {
		return `${hash.slice(0, 6)}...${hash.slice(-4)}`
	}

	const totalPages = Math.ceil(orders.length / ordersPerPage)

	return (
		<Container>
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
					{currentOrders.map((order, index) => {
						console.log({
							order,
							index,
						})
						return (
							<Tr key={order.orderSignature}>
								<Td>
									{order.orderSignature &&
										shortenHash(order.orderSignature)}
								</Td>
								<Td>{order.startTime}</Td>
								<Td>{order.completed ? '✔️' : 'x'}</Td>
							</Tr>
						)
					})}
				</tbody>
			</Table>
			<Pagination>
				{totalPages > 3 && (
					<PaginationButton onClick={() => paginate(1)}>
						First
					</PaginationButton>
				)}
				{Array.from({ length: totalPages }, (_, i) => (
					<PaginationButton
						key={i + 1}
						onClick={() => paginate(i + 1)}
					>
						{i + 1}
					</PaginationButton>
				))}
				{totalPages > 3 && (
					<PaginationButton onClick={() => paginate(totalPages)}>
						Last
					</PaginationButton>
				)}
			</Pagination>
		</Container>
	)
}

export default OrderTable

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 24px;
	width: 480px;
`

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

const Pagination = styled.div`
	display: flex;
	justify-content: center;
	margin-top: 16px;
`

const PaginationButton = styled.button`
	background-color: #333;
	color: #fff;
	border: 1px solid #444;
	padding: 8px 16px;
	margin: 0 4px;
	cursor: pointer;

	&:hover {
		background-color: #555;
	}
`
