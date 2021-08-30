/* global process */

import chainSdk from 'sdk'
import { store } from 'app'

import { useRouterHistory } from 'react-router'
import { createHistory } from 'history'
let apiHost, basename
if (process.env.TARGET === 'electron') {
  apiHost = 'http://localhost:9888'
  basename = ''
} else if (process.env.NODE_ENV === 'production') {
  apiHost = window.location.origin
  basename = '/dashboard'
} else {
  apiHost = process.env.API_URL || 'http://localhost:9889'
  basename = ''
}


export const chainClient = () => new chainSdk.Client({
  url: apiHost,
  accessToken: store.getState().core.clientToken
})

export const chainSigner = () => new chainSdk.HsmSigner()

// react-router history object
export const history = useRouterHistory(createHistory)({
  basename: basename
})

export const btmID = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

export const pageSize = 25
export const UTXOpageSize = 10

export const federationApiHost = `${window.location.protocol}//${window.location.hostname}:9886`

export const testnetInfoUrl = process.env.TESTNET_INFO_URL || 'https://testnet-info.chain.com'
export const testnetUrl = process.env.TESTNET_GENERATOR_URL || 'https://testnet.chain.com'
export const equityRoot = process.env.TARGET === 'electron' ? 'http://localhost:9888/equity' : '/equity'
export const docsRoot = 'https://developer.bytom.io/'
export const docsRootZH = 'https://developer.bytom.io/zh/'

export const releaseUrl = 'https://github.com/Bytom/bytom/releases'
