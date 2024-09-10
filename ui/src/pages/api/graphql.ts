import { getGraphQLClient } from '@/graphql'
import { gql } from '@apollo/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { omit } from 'lodash'

type Data = {}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const body = await req.body.json()
	const type = body.mutation ? 'mutation' : 'query'
	console.log({ body, type })
	let response

	if (type === 'query') {
		response = await getGraphQLClient().query({
			query: gql`
				${body[type]}
			`,
			variables: body.variables,
			fetchPolicy: 'no-cache',
		})
	} else {
		response = await getGraphQLClient().mutate({
			mutation: gql`
				${body[type]}
			`,
			variables: body.variables,
			fetchPolicy: 'no-cache',
		})
	}

	res.status(200).json(omit(response, ['loading', 'networkStatus']))
}
