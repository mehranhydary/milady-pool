import { parse } from 'graphql'
import { readFileSync } from 'fs'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

export const supportImportGraphQL = () => {
	const VALID_EXTENSIONS = ['graphql', 'graphqls', 'gql', 'gqls']

	function handleModule(m: typeof module, filename: string) {
		const content = readFileSync(filename, 'utf-8')

		m.exports = parse(content)
	}

	VALID_EXTENSIONS.forEach((ext) => {
		require.extensions[`.${ext}`] = handleModule
	})
}

supportImportGraphQL()
