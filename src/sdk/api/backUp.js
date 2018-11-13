const shared = require('../shared')

const backUp = (client) => {
  return {
    backup: (cb) => shared.tryCallback(
      client.request('/backup-wallet', {}, true),
      cb
    ),

    restore: (opts = {}, cb) => shared.tryCallback(
      client.request('/restore-wallet', opts),
      cb
    ),

    recovery: (opts = {}, cb) => shared.tryCallback(
      client.request('/recovery-wallet', opts),
      cb
    ),

    rescan: (cb) => shared.tryCallback(
      client.request('/rescan-wallet'),
      cb
    ),

    info: (cb) => shared.tryCallback(
      client.request('/wallet-info'),
      cb
    ),
  }
}

module.exports = backUp
