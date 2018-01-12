const shared = require('../shared')
const util = require('../util')

const authorizationGrants = (client) => ({
  create: (params, cb) => {
    params = Object.assign({}, params)
    if (params.guardType == 'x509') {
      params.guardData = util.sanitizeX509GuardData(params.guardData)
    }

    return shared.create(
      client,
      '/create-authorization-grant',
      params,
      {skipArray: true, cb}
    )
  },

  delete: (params, cb) => shared.tryCallback(
    client.request('/delete-authorization-grant', params),
    cb
  ),

  list: (cb) =>
    shared.query(client, 'accessTokens', '/list-access-tokens', {}, {cb}),
})

module.exports = authorizationGrants
