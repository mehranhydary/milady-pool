import express from 'express'
import { createServer } from 'http'

export const app = express()
export const httpServer = createServer(app)
