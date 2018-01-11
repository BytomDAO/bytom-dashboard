const shared = require('../shared')

const balancesAPI = (client) => {
  return {
    query: (params, cb) => shared.query(client, 'balances', '/list-balances', params, {cb}),

    queryAll: (params, processor, cb) => shared.queryAll(client, 'balances', params, processor, cb),
  }
}

module.exports = balancesAPI
