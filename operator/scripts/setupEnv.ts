import 'dotenv/config'
import '../utils/import-graphql'
import axios from 'axios'

import {
	globalHttpsKeepAliveAgent,
	globalHttpKeepAliveAgent,
} from '../lib/axios'

import fetch from 'minipass-fetch'
import http from 'http'
import https from 'https'

axios.defaults.httpAgent = globalHttpKeepAliveAgent
axios.defaults.httpsAgent = globalHttpsKeepAliveAgent
http.globalAgent = globalHttpKeepAliveAgent
https.globalAgent = globalHttpsKeepAliveAgent

// @ts-ignore
global.fetch = fetch

Object.assign(
	BigInt.prototype,
	'toJSON',
	function (this: typeof BigInt.prototype) {
		return this.toString()
	}
)

// TODO: Need to add ws...
