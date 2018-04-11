const shared = require('../shared')

const configAPI = (client) => {
  return {
    reset: (everything = false, cb) => shared.tryCallback(
      client.request('/reset', {everything: everything}),
      cb
    ),

    configure: (opts = {}, cb) => shared.tryCallback(
      client.request('/configure', opts),
      cb
    ),

    mining: (miningState = false, cb) => shared.tryCallback(
      client.request('/set-mining', {is_mining: miningState}),
      cb
    ),

    info: (cb) => shared.tryCallback(
      client.request('/net-info'),
      cb
    ),
  }
}

module.exports = configAPI
