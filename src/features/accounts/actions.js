import { chainClient } from 'utility/environment'
import { baseCreateActions, baseUpdateActions, baseListActions } from 'features/shared/actions'
import {push} from 'react-router-redux'

const type = 'account'

const list = baseListActions(type, { defaultKey: 'alias' })
const create = baseCreateActions(type, {
  jsonFields: ['tags'],
  intFields: ['quorum'],
  redirectToShow: true,
})
const update = baseUpdateActions(type, {
  jsonFields: ['tags']
})

const switchAccount = (accountAlias) => {
  return (dispatch) => {
    dispatch({type: 'SET_CURRENT_ACCOUNT', account: accountAlias})
  }
}

const setDefaultAccount = () =>{
  return (dispatch) => {
    return chainClient().accounts.query().then(result => {
      const account = result.data[0].alias
      dispatch(switchAccount((account)))
      return account
    })
  }
}
const createAccount = (data) => {
  return (dispatch) => {
    if (typeof data.alias == 'string')  data.alias = data.alias.trim()

    const keyData = {
      'alias': `${data.alias}Key`,
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
          'alias': data.alias}

        dispatch({type: 'NEW_KEY', data: resp.data.mnemonic})

        return chainClient().accounts.create(accountData)
          .then((resp) => {
            if (resp.status === 'fail') {
              throw resp
            }

            if(resp.status === 'success') {
              dispatch({type: 'SET_CURRENT_ACCOUNT', account: resp.data.alias})
              dispatch( push('/accounts/mnemonic') )
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

const createSuccess = ()=> (dispatch) =>{
  dispatch(create.created())
  dispatch(push('/accounts'))
}

let actions = {
  ...list,
  ...create,
  ...update,
  createReceiver: (data) => () => {
    return chainClient().accounts.createReceiver(data)
  },
  createAddress: (data) => () => {
    return chainClient().accounts.createAddress(data)
  },
  listAddresses: (accountId) => {
    return chainClient().accounts.listAddresses({accountId})
  },
  switchAccount,
  setDefaultAccount,
  createAccount,
  createSuccess
}

export default actions
