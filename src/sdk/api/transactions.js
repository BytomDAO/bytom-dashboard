const shared = require('../shared')
const errors = require('../errors')

// TODO: replace with default handler in requestSingle/requestBatch variants
function checkForError(resp) {
  if ('code' in resp) {
    throw errors.create(
      errors.types.BAD_REQUEST,
      errors.formatErrMsg(resp, ''),
      {body: resp}
    )
  }
  return resp
}

class TransactionBuilder {
  constructor() {
    this.actions = []


    this.allowAdditionalActions = false

    this.baseTransaction = null
  }

  issue(params) {
    this.actions.push(Object.assign({}, params, {type: 'issue'}))
  }

  controlWithReceiver(params) {
    this.actions.push(Object.assign({}, params, {type: 'control_receiver'}))
  }

  spendFromAccount(params) {
    this.actions.push(Object.assign({}, params, {type: 'spend_account'}))
  }

  spendUnspentOutput(params) {
    this.actions.push(Object.assign({}, params, {type: 'spend_account_unspent_output'}))
  }

  retire(params) {
    this.actions.push(Object.assign({}, params, {type: 'retire'}))
  }

  transactionReferenceData(referenceData) {
    this.actions.push({
      type: 'set_transaction_reference_data',
      referenceData
    })
  }
}

const transactionsAPI = (client) => {
  // TODO: implement finalize
  const finalize = (template, cb) => shared.tryCallback(
    Promise.resolve(template),
    cb
  )

  // TODO: implement finalizeBatch
  const finalizeBatch = (templates, cb) => shared.tryCallback(
    Promise.resolve(new shared.BatchResponse(templates)),
    cb
  )

  return {
    query: (params, cb) => shared.query(client, 'transactions', '/list-transactions', params, {cb}),

    queryAll: (params, processor, cb) => shared.queryAll(client, 'transactions', params, processor, cb),

    build: (builderBlock, cb) => {
      const builder = new TransactionBuilder()

      try {
        builderBlock(builder)
      } catch (err) {
        return Promise.reject(err)
      }

      return shared.tryCallback(
        client.request('/build-transaction', builder, true),
        cb
      )
    },

    buildBatch: (builderBlocks, cb) => {
      const builders = []
      for (let i in builderBlocks) {
        const b = new TransactionBuilder()
        try {
          builderBlocks[i](b)
        } catch (err) {
          return Promise.reject(err)
        }
        builders.push(b)
      }

      return shared.createBatch(client, '/build-transaction', builders, {cb})
    },

    sign: (template, cb) => finalize(template)
      .then(finalized => client.signer.sign(finalized, cb)),

    signBatch: (templates, cb) => finalizeBatch(templates)
      // TODO: merge batch errors from finalizeBatch
      .then(finalized => client.signer.signBatch(finalized.successes, cb)),

    submit: (signed, cb) => shared.tryCallback(
      client.request('/submit-transaction', {transactions: [signed]}).then(resp => checkForError(resp[0])),
      cb
    ),

    submitBatch: (signed, cb) => shared.tryCallback(
      client.request('/submit-transaction', {transactions: signed})
            .then(resp => new shared.BatchResponse(resp)),
      cb
    ),
  }
}

module.exports = transactionsAPI
