const shared = require('../shared')

const unspentOutputsAPI = (client) => {
  return {
    query: (params, cb) => shared.query(client, 'unspentOutputs', '/list-unspent-outputs', params, {cb}),

    queryAll: (params, processor, cb) => shared.queryAll(client, 'unspentOutputs', params, processor, cb),
  }
}

module.exports = unspentOutputsAPI
