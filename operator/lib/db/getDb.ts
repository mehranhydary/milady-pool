import { type DB, db } from './model'

export const getDb = () => db as unknown as DB
