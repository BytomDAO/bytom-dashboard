const shared = require('../shared')

const assetsAPI = (client) => {

  return {
    create: (params, cb) => shared.create(client, '/create-asset', params, {cb, skipArray: true}),

    createBatch: (params, cb) => shared.createBatch(client, '/create-asset', params, {cb}),

    updateTags: (params, cb) => {
      const finalParams = {
        asset_info: params.id,
        tags: params.tags
      }
      return shared.singletonBatchRequest(client, '/update-asset-tags', finalParams, cb)
    },

    updateAlias: (params, cb) => {
      const finalParams = {
        id: params.id,
        alias: params.alias
      }
      return shared.singletonBatchRequest(client, '/update-asset-alias', finalParams, cb)
    },

    updateTagsBatch: (params, cb) => shared.batchRequest(client, '/update-asset-tags', params, cb),

    query: (params, cb) => shared.query(client, 'assets', '/list-assets', params, {cb}),

    queryAll: (params, processor, cb) => shared.queryAll(client, 'assets', params, processor, cb),
  }
}

module.exports = assetsAPI
