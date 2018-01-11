const shared = require('../shared')

class HsmSigner {

  constructor() {
    this.signers = {}
  }

  addKey(key, connection) {
    const id = `${connection.baseUrl}-${connection.token || 'noauth'}`
    let signer = this.signers[id]
    if (!signer) {
      signer = this.signers[id] = {
        connection: connection,
        xpubs: []
      }
    }

    signer.xpubs.push(typeof key == 'string' ? key : key.xpub)
  }

  sign(template, cb) {
    let promise = Promise.resolve(template)

    // Return early if no signers
    if (Object.keys(this.signers).length == 0) {
      return shared.tryCallback(promise, cb)
    }

    for (let signerId in this.signers) {
      const signer = this.signers[signerId]

      promise = promise.then(nextTemplate =>
        signer.connection.request('/sign-transaction', {
          transactions: [nextTemplate],
          xpubs: signer.xpubs
        })
      ).then(resp => resp[0])
    }

    return shared.tryCallback(promise, cb)
  }

  signBatch(templates, cb) {
    templates = templates.filter((template) => template != null)
    let promise = Promise.resolve(templates)

    // Return early if no signers
    if (Object.keys(this.signers).length == 0) {
      return shared.tryCallback(promise.then(() => new shared.BatchResponse(templates)), cb)
    }

    let originalIndex = [...Array(templates.length).keys()]
    const errors = []

    for (let signerId in this.signers) {
      const nextTemplates = []
      const nextOriginalIndex = []
      const signer = this.signers[signerId]

      promise = promise.then(txTemplates =>
        signer.connection.request('/sign-transaction', {
          transactions: txTemplates,
          xpubs: signer.xpubs
        }).then(resp => {
          const batchResponse = new shared.BatchResponse(resp)

          batchResponse.successes.forEach((template, index) => {
            nextTemplates.push(template)
            nextOriginalIndex.push(originalIndex[index])
          })

          batchResponse.errors.forEach((error, index) => {
            errors[originalIndex[index]] = error
          })

          originalIndex = nextOriginalIndex
          return nextTemplates
        })
      )
    }

    return shared.tryCallback(promise.then(txTemplates => {
      const resp = []
      txTemplates.forEach((item, index) => {
        resp[originalIndex[index]] = item
      })

      errors.forEach((error, index) => {
        if (error != null) {
          resp[index] = error
        }
      })

      return new shared.BatchResponse(resp)
    }), cb)
  }
}

module.exports = HsmSigner
