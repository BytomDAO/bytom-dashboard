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

    info: (cb) => shared.tryCallback(
      client.request('/net-info'),
      cb
    ),
  }
}

module.exports = configAPI
