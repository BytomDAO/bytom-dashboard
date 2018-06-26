const bytomCLI = (client) => {

  return {
    request: (params) => {
      const cmdArrays = params.split(' ')
      let requestParams = {}

      const blockHeightArray =['get-block', 'get-block-header', 'get-difficulty', 'get-hash-rate']
      if(cmdArrays[0] === 'validate-address'){
        requestParams = {
          'address': cmdArrays[1]
        }
      }else if(cmdArrays[0] === 'sign-message') {
        requestParams = {
          'address': cmdArrays[1],
          'message': cmdArrays[2],
          'password':  cmdArrays[3]
        }
      }else if(cmdArrays[0] === 'get-transaction') {
        requestParams = {
          'tx_id': cmdArrays[1]
        }
      }else if(cmdArrays[0] === 'sign-transaction') {
        requestParams = {
          'password': cmdArrays[1],
          'transaction': JSON.parse(cmdArrays[2])
        }
      }else if(cmdArrays[0] === 'build-transaction') {
        requestParams = {
          'base_transaction': JSON.parse(cmdArrays[1]),
          'actions':JSON.parse(cmdArrays[2]),
          'ttl': Number(cmdArrays[3]),
          'time_range': Number(cmdArrays[4])
        }
      }else if(cmdArrays[0] === 'submit-transaction') {
        requestParams = {
          'raw_transaction': JSON.parse(cmdArrays[1])
        }
      }else if(cmdArrays[0] === 'estimate-transaction-gas') {
        requestParams = {
          'transaction_template': JSON.parse(cmdArrays[1])
        }
      }else if(cmdArrays[0] === 'get-unconfirmed-transaction') {
        requestParams = {
          'tx_id': cmdArrays[1]
        }
      }else if(cmdArrays[0] === 'decode-raw-transaction') {
        requestParams = {
          'raw_transaction': cmdArrays[1]
        }
      }else if(blockHeightArray.includes(cmdArrays[0])) {
        if(cmdArrays[1]){
          if(!isNaN(cmdArrays[1])){
            requestParams = {
              'block_height': Number(cmdArrays[1])
            }
          }else {
            requestParams = {
              'block_hash': cmdArrays[1]
            }
          }
        }
      }else if(cmdArrays[0] === 'set-mining') {
        requestParams = {
          'is_mining': cmdArrays[1] === 'true' || (cmdArrays[1] === 'false' ? false : cmdArrays[1])
        }
      }else if(cmdArrays[0] === 'verify-message') {
        requestParams = {
          'address': cmdArrays[1],
          'derived_xpub': cmdArrays[2],
          'message': cmdArrays[3],
          'signature': cmdArrays[4]
        }
      }else if(cmdArrays[0] === 'decode-program') {
        requestParams = {
          'program': cmdArrays[1]
        }
      }

      return client.request(`/${cmdArrays[0]}`, requestParams)
    }
  }
}

module.exports = bytomCLI
