const Connection = require('./connection')
const authorizationGrantsAPI = require('./api/authorizationGrants')
const accessTokensAPI = require('./api/accessTokens')
const accountsAPI = require('./api/accounts')
const assetsAPI = require('./api/assets')
const backUpAPI = require('./api/backUp')
const balancesAPI = require('./api/balances')
const bytomCLI = require('./api/bytomCLI')
const configAPI = require('./api/config')
const federationAPI = require('./api/federations')
const hsmSigner = require('./api/hsmSigner')
const mockHsmKeysAPI = require('./api/mockHsmKeys')
const transactionsAPI = require('./api/transactions')
const transactionFeedsAPI = require('./api/transactionFeeds')
const unspentOutputsAPI = require('./api/unspentOutputs')
const peersAPI = require('./api/peer')

class Client {
  constructor(opts = {}) {
    // If the first argument is a string,
    // support the deprecated constructor params.
    if (typeof opts === 'string') {
      opts = {
        url: arguments[0],
        accessToken: arguments[1] || ''
      }
    }
    opts.url = opts.url || 'http://localhost:9889'
    this.connection = new Connection(opts.url, opts.accessToken, opts.agent)
    this.signer = new hsmSigner()

    this.accessTokens = accessTokensAPI(this)

    this.authorizationGrants = authorizationGrantsAPI(this)

    this.accounts = accountsAPI(this)

    this.assets = assetsAPI(this)

    this.backUp = backUpAPI(this)

    this.balances = balancesAPI(this)

    this.bytomCli = bytomCLI(this)

    this.config = configAPI(this)

    this.federations = federationAPI(this)

    this.mockHsm = {
      keys: mockHsmKeysAPI(this),
      signerConnection: new Connection(`${opts.url}/mockhsm`, opts.accessToken, opts.agent)
    }

    this.peers = peersAPI(this)

    this.transactions = transactionsAPI(this)

    this.transactionFeeds = transactionFeedsAPI(this)

    this.unspentOutputs = unspentOutputsAPI(this)
  }


  request(path, body = {}, skipSnakeize = false) {
    return this.connection.request(path, body, skipSnakeize)
  }
}

module.exports = Client
