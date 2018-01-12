const shared = require('../shared')

const accessTokens = (client) => {
  return {
    create: (params, cb) =>
      shared.create(client, '/create-access-token', params, {skipArray: true, cb}),

    query: (params, cb) => shared.query(client, 'accessTokens', '/list-access-tokens', params, {cb}),

    queryAll: (params, processor, cb) => shared.queryAll(client, '/list-access-tokens', params, processor, cb),

    delete: (id, cb) => shared.tryCallback(
      client.request('/delete-access-token', {id: id}),
      cb
    ),
  }
}

module.exports = accessTokens
