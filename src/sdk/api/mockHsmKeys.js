const shared = require('../shared')

const mockHsmKeysAPI = (client) => {
  return {
    create: (params, cb) => {
      let body = Object.assign({}, params)
      const uri = body.xprv ? '/import-private-key' : '/create-key'

      return shared.tryCallback(
        client.request(uri, body).then(data => data),
        cb
      )
    },

    query: (params, cb) => {
      if (Array.isArray(params.aliases) && params.aliases.length > 0) {
        params.pageSize = params.aliases.length
      }

      return shared.query(client, 'mockHsm.keys', '/list-keys', params, {cb})
    },

    resetPassword: (params) =>  client.request('/reset-key-password', params),

    checkPassword:  (params) =>  client.request('/check-key-password', params),

    queryAll: (params, processor, cb) => shared.queryAll(client, 'mockHsm.keys', params, processor, cb),

    export: (params) => client.request('/export-private-key', params),

    progress: () => client.request('/import-key-progress')
  }
}

module.exports = mockHsmKeysAPI
