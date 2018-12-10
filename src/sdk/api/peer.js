const shared = require('../shared')

const peersAPI = (client) => {
  return {
    query: (params, cb) => shared.query(client, 'peers', '/list-peers', params, {cb}),

    queryAll: (params, processor, cb) => shared.queryAll(client, 'peers', params, processor, cb),

    connect: (params, cb) => shared.query(client, 'peers', '/connect-peer', params, {cb}),

    disconnect: (params, cb) => shared.query(client, 'peers', '/disconnect-peer', params, {cb}),
  }
}

module.exports = peersAPI
