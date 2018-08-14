const shared = require('../shared')

const accountsAPI = (client) => {
  return {
    create: (params, cb) => shared.create(client, '/create-account', params, {cb, skipArray: true}),

    createBatch: (params, cb) => shared.createBatch(client, '/create-account', params, {cb}),

    updateTags: (params, cb) => {
      return shared.singletonBatchRequest(client, '/update-account-tags', {
        account_info: params.id,
        tags: params.tags
      }, cb)
    },

    updateTagsBatch: (params, cb) => shared.batchRequest(client, '/update-account-tags', params, cb),

    query: (params, cb) => shared.query(client, 'accounts', '/list-accounts', params, {cb}),

    queryAll: (params, processor, cb) => shared.queryAll(client, 'accounts', params, processor, cb),

    createReceiver: (params, cb) => shared.create(client, '/create-account-receiver', params, {cb, skipArray: true}),

    createAddress: (params, cb) => shared.create(client, '/create-account-receiver', params, {cb, skipArray: true}),

    createReceiverBatch: (params, cb) => shared.createBatch(client, '/create-account-receiver', params, {cb}),

    listAddresses: (accountId) => shared.query(client, 'accounts', '/list-addresses', {account_id: accountId}),

    validateAddresses: (address, cb) => shared.query(client, 'accounts', '/validate-address', {'address': address},  {cb})
  }
}

module.exports = accountsAPI
