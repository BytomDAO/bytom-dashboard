const shared = require('../shared')
const Connection = require('../connection')

import { federationApiHost } from 'utility/environment'

const federationEndpoint = '/api/v1/federation/'

const federationAPI = (client) => {
  return {
    query: (params, cb) => shared.query( new Connection(federationApiHost, '', ''), 'federation', `${federationEndpoint}list-crosschain-txs`, params, {cb}),

    queryAll: (params, processor, cb) => shared.queryAll(client, 'federation', params, processor, cb),
  }
}

module.exports = federationAPI
