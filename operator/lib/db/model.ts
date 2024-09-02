import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface PrismaClientWithHooks extends PrismaClient {
	addDbHook: (this: PrismaClient, cb: Prisma.Middleware) => void
	hooksConfigured?: boolean
}

;(PrismaClient.prototype as PrismaClientWithHooks).addDbHook = function (
	this: PrismaClient,
	cb: Prisma.Middleware
) {
	prisma.$use(cb)
	Object.assign(prisma, { hooksConfigured: true })
}

export const db = (prisma as PrismaClientWithHooks).$extends({
	model: {
		$allModels: {
			async findOrCreate<
				Model,
				Args extends Prisma.Args<Model, 'upsert'>
			>(
				this: Model,
				upsertArgs: Args
			): Promise<Prisma.Result<Model, Args, 'upsert'>> {
				try {
					const doc = await (this as any).upsert(upsertArgs)
					return doc
				} catch (e: any) {
					if (e instanceof Prisma.PrismaClientKnownRequestError) {
						if (['P2002'].includes(e.code)) {
							console.warn(`[WARN] ${e.message}`)
							const doc = await (this as any).upsert(upsertArgs)
							return doc
						}
					}
					console.error(e)
					throw e
				}
			},
		},
	},
	query: {
		order: {
			// TODO: Figure out what to put here if anything
		},
	},
})

export type ExtendedPrisma = typeof db
export interface DB extends ExtendedPrisma {
	addDbHook: (cb: Prisma.Middleware) => void
	hooksConfigured: boolean
}
export { Prisma as Schema }
