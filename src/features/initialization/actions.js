import { chainClient } from 'utility/environment'
import {push} from 'react-router-redux'
import uuid from 'uuid'

const registerKey = (data) => {
  return (dispatch) => {
    if (typeof data.accountAlias == 'string')  data.accountAlias = data.accountAlias.trim()

    const keyData = {
      'alias': `${data.accountAlias}Key-${uuid.v4()}`,
      'password': data.password
    }

    return chainClient().mockHsm.keys.create(keyData)
      .then((resp) => {
        if (resp.status === 'fail') {
          throw resp
        }

        const accountData = {
          'root_xpubs':[resp.data.xpub],
          'quorum':1,
          'alias': data.accountAlias}

        dispatch({type: 'INIT_ACCOUNT', data: resp.data.mnemonic})

        return chainClient().accounts.create(accountData)
          .then((resp) => {
            if (resp.status === 'fail') {
              throw resp
            }

            if(resp.status === 'success') {
              dispatch({type: 'SET_CURRENT_ACCOUNT', account: resp.data.alias})
              dispatch(initSucceeded())
            }
          })
          .catch((err) => {
            throw err
          })
      })
      .catch((err) => {
        throw err
      })
  }
}

const restoreKeystore = (data, success) => {
  return (dispatch) => {
    const file = data.file

    return new Promise(function(resolve, reject){
      const fileReader = new FileReader()

      fileReader.onload = function(e) {
        const result = JSON.parse(e.target.result)
        return chainClient().backUp.restore(result)
          .then(resp => {
            if (resp.status === 'fail') {
              throw resp
            }
            resolve()
            dispatch(success)
          })
          .catch((err) => {
            reject(err) })
      }

      fileReader.readAsText(file, 'UTF-8')
      fileReader.onerror = function(error) { reject(error) }
    })
  }
}

const restoreMnemonic = (data, success) => {
  return (dispatch) => {
    if (typeof data.mnemonic == 'string') data.mnemonic = data.mnemonic.trim()

    const keyData = {
      'alias': `key-${uuid.v4()}`,
      'password': data.password,
      'mnemonic': data.mnemonic
    }

    return chainClient().mockHsm.keys.create(keyData)
      .then((resp) => {
        if (resp.status === 'fail') {
          throw resp
        }else{
          return chainClient().backUp.recovery({
            xpubs: [resp.data.xpub]
          })
            .then((resp) => {
              if (resp.status === 'fail') {
                throw resp
              }

              dispatch(success)
            })
            .catch((err) => {
              throw err
            })
        }
      })
      .catch((err) => {
        throw err
      })
  }
}

const initSucceeded = () => (dispatch) => {
  dispatch({type: 'CREATE_REGISTER_ACCOUNT'})
  dispatch(push({
    pathname: '/transactions',
    state: {
      preserveFlash: true
    }
  }))
}

let actions = {
  initSucceeded,
  registerKey,
  restoreKeystore,
  restoreMnemonic
}

export default actions
