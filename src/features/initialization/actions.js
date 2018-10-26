import { chainClient } from 'utility/environment'
import {push} from 'react-router-redux'

const registerKey = (data) => {
  return (dispatch) => {
    if (typeof data.keyAlias == 'string')  data.keyAlias = data.keyAlias.trim()

    const keyData = {
      'alias': data.keyAlias,
      'password': data.password
    }

    return chainClient().mockHsm.keys.create(keyData)
      .then((resp) => {
        if (resp.status === 'fail') {
          throw resp
        }

        if (typeof data.accountAlias == 'string')  data.accountAlias = data.accountAlias.trim()
        const accountData = {
          'root_xpubs':[resp.data.xpub],
          'quorum':1,
          'alias': data.accountAlias}

        dispatch({type: 'INIT_ACCOUNT', data: resp.data.mnemonic})

        chainClient().accounts.create(accountData)
          .then((resp) => {
            if (resp.status === 'fail') {
              throw resp
            }

            if(resp.status === 'success') {
              dispatch(push('/initialization/mnemonic'))
            }
          })
          .catch((err) => {
            if (!err.status) {
              throw err
            }
          })
      })
      .catch((err) => {
        if (!err.status) {
          throw err
        }
      })
  }
}

const restoreKeystore = (data) => {
  return (dispatch) => {
    const file = data.file

    return new Promise(function(resolve, reject){
      const fileReader = new FileReader()

      fileReader.onload = function(e) {
        const result = JSON.parse(e.target.result)
        return chainClient().backUp.restore(result)
          .then(resp => {
            if (resp.status === 'fail') {
              reject(resp)
            }
            resolve()
            console.log('success')
          })
          .catch((err) => {
            reject(err) })
      }
      fileReader.readAsText(file, 'UTF-8')
      fileReader.onerror = function(error) { reject(error) }
    })
  }
}

let actions = {
  registerKey,
  restoreKeystore
}

export default actions
