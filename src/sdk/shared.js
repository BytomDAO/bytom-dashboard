const uuid = require('uuid')
const errors = require('./errors')
const Page = require('./page')

class BatchResponse {
  constructor(resp) {
    this.successes = []

    this.errors = []

    resp.forEach((item, index) => {
      if (item.code) {
        this.errors[index] = item
      } else {
        this.successes[index] = item
      }
    })

    this.response = resp
  }
}

const tryCallback = (promise, cb) => {
  if (typeof cb !== 'function') return promise

  return promise.then(value => {
    setTimeout(() => cb(null, value), 0)
  }, error => {
    setTimeout(() => cb(error, null), 0)
  })
}

const batchRequest = (client, path, params, cb) => {
  return tryCallback(
    client.request(path, params).then(resp => new BatchResponse(resp)),
    cb
  )
}

module.exports = {
  batchRequest,

  singletonBatchRequest: (client, path, params = {}, cb) => {
    return tryCallback(
      client.request(path, params),
      cb
    )
  },

  create: (client, path, params = {}, opts = {}) => {
    const object = Object.assign({}, params)
    let body = object
    if (!opts.skipArray) {
      body = [body]
    }

    return tryCallback(
      client.request(path, body).then(data => {
        if (errors.isBatchError(data[0])) throw errors.newBatchError(data[0])

        if (Array.isArray(data)) return data[0]
        return data
      }),
      opts.cb
    )
  },

  createBatch: (client, path, params = [], opts = {}) => {
    params = params.map((item) =>
      Object.assign({ clientToken: uuid.v4() }, item))

    return tryCallback(
      client.request(path, params).then(resp => new BatchResponse(resp)),
      opts.cb
    )
  },

  query: (client, memberPath, path, params = {}, opts = {}) => {
    return tryCallback(
      client.request(path, params).then(data => new Page(data, client, memberPath)),
      opts.cb
    )
  },

  /*
   * NOTE: Requires query to be implemented on client for the specified member.
   */
  queryAll: (client, memberPath, params, processor = () => {}, cb) => {
    let nextParams = params

    let queryOwner = client
    memberPath.split('.').forEach((member) => {
      queryOwner = queryOwner[member]
    })

    const promise = new Promise((resolve, reject) => {
      const done = (err) => {
        if (cb) {
          cb(err)
          return
        } else if (err) {
          reject(err)
        }

        resolve()
      }

      const nextPage = () => {
        queryOwner.query(nextParams).then(page => {
          let index = 0
          let item

          const next = () => {
            if (index >= page.items.length) {
              if (page.lastPage) {
                done()
              } else {
                nextParams = page.next
                nextPage()
              }
              return
            }

            item = page.items[index]
            index++

            // Pass the next item to the processor, as well as two loop
            // operations:
            //
            // - next(): Continue to next item
            // - done(err): Then terminate the loop by fulfilling the outer promise
            //
            // The process can also terminate the loop by returning a promise
            // that will reject.

            let res = processor(item, next, done)
            if (res && typeof res.catch === 'function') {
              res.catch(reject)
            }
          }

          next()
        }).catch(reject) // fail processor loop on query failure
      }

      // nextPage()
    })

    return tryCallback(promise, cb)
  },

  tryCallback,
  BatchResponse,
}
