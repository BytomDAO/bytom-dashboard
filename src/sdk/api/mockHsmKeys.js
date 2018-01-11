const uuid = require('uuid')
const shared = require('../shared')

const mockHsmKeysAPI = (client) => {
  return {
    create: (params, cb) => {
      let body = Object.assign({ clientToken: uuid.v4() }, params, {password: '123456'})
      return shared.tryCallback(
        client.request('/create-key', body).then(data => data),
        cb
      )
    },

    query: (params, cb) => {
      if (Array.isArray(params.aliases) && params.aliases.length > 0) {
        params.pageSize = params.aliases.length
      }

      return shared.query(client, 'mockHsm.keys', '/list-keys', params, {cb})
    },

    queryAll: (params, processor, cb) => shared.queryAll(client, 'mockHsm.keys', params, processor, cb),
  }
}

module.exports = mockHsmKeysAPI
