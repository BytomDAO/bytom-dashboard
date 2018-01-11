const shared = require('../shared')

const uuid = require('uuid')

const MAX_BLOCK_HEIGHT = '9223372036854775807'

class TransactionFeed {
  constructor(feed, client) {
    this.id = feed['id']
    this.alias = feed['alias']
    this.after = feed['after']
    this.filter = feed['filter']

    let nextAfter

    const ack = () => client.request('/update-transaction-feed', {
      id: this.id,
      after: nextAfter,
      previousAfter: this.after
    }).then(() => { this.after = nextAfter })

    const query = params => client.transactions.query(params)

    this.consume = (consumer, ...args) => {
      let timeout = 24*60*60
      let cb
      switch (args.length) {
        case 0:
          // promise with default timeout
          break
        case 1:
          if (args[0] instanceof Function) {
            cb = args[0]
          } else {
            timeout = args[0]
          }
          break
        case 2:
          timeout = args[0]
          cb = args[1]
          break
        default:
          throw new Error('Invalid arguments')
      }

      const promise = new Promise((resolve, reject) => {
        let queryArgs = {
          filter: this.filter,
          after: this.after,
          timeout: (timeout * 1000),
          ascendingWithLongPoll: true,
        }

        const nextPage = () => {
          query(queryArgs).then(page => {
            let index = 0
            let prevItem

            const done = shouldAck => {
              let p
              if (shouldAck) {
                p = ack(prevItem)
              } else {
                p = Promise.resolve()
              }
              p.then(resolve).catch(reject)
            }

            const next = shouldAck => {
              let p
              if (shouldAck && prevItem) {
                p = ack(prevItem)
              } else {
                p = Promise.resolve()
              }

              p.then(() => {
                if (index >= page.items.length) {
                  queryArgs = page.next
                  nextPage()
                  return
                }

                prevItem = page.items[index]
                nextAfter = `${prevItem.blockHeight}:${prevItem.position}-${MAX_BLOCK_HEIGHT}`
                index++

                // Pass the next item to the consumer, as well as three loop
                // operations:
                //
                // - next(shouldAck): maybe ack, then continue/long-poll to next item.
                // - done(shouldAck): maybe ack, then terminate the loop by fulfilling the outer promise.
                // - fail(err): terminate the loop by rejecting the outer promise.
                //              Use this if you want to bubble an async error up to
                //              the outer promise catch function.
                //
                // The consumer can also terminate the loop by returning a promise
                // that will reject.

                let res = consumer(prevItem, next, done, reject)
                if (res && typeof res.catch === 'function') {
                  res.catch(reject)
                }
              }).catch(reject) // fail consume loop on ack failure, or on thrown exceptions from "then" function
            }

            next()
          }).catch(reject) // fail consume loop on query failure
        }

        nextPage()
      })

      return shared.tryCallback(promise, cb)
    }
  }
}

const transactionFeedsAPI = (client) => {
  return {
    create: (params, cb) => {
      let body = Object.assign({ clientToken: uuid.v4() }, params)
      return shared.tryCallback(
        client.request('/create-transaction-feed', body).then(data => new TransactionFeed(data, client)),
        cb
      )
    },

    get: (params, cb) => shared.tryCallback(
      client.request('/get-transaction-feed', params).then(data => new TransactionFeed(data, client)),
      cb
    ),

    delete: (params, cb) => shared.tryCallback(
      client.request('/delete-transaction-feed', params).then(data => data),
      cb
    ),


    query: (params, cb) => shared.query(client, 'transactionFeeds', '/list-transaction-feeds', params, {cb}),

    queryAll: (params, processor, cb) => shared.queryAll(client, 'transactionFeeds', params, processor, cb),
  }
}

module.exports = transactionFeedsAPI
