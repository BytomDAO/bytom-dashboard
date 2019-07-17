import { chainClient } from 'utility/environment'
import { baseCreateActions, baseUpdateActions, baseListActions } from 'features/shared/actions'
import {push} from 'react-router-redux'
import action from 'actions'

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

const setMiningAddress = (accountAlias) =>{
  return action.transaction.getAddresses({accountAlias}).then(address => {
    return chainClient().accounts.setMiningAddress({'miningAddress':address}).then(resp =>{
      if (resp.status === 'fail') {
        throw resp
      }

      return resp
    })
  })
}

const setDefaultAccount = () =>{
  return (dispatch) => {
    return chainClient().accounts.query().then(result => {
      const account = result.data[0].alias
      return setMiningAddress(account).then(()=>{
        dispatch(switchAccount((account)))
        return account
      })
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

        if (data.xpubs) {
          data.rootXpubs = [resp.data.xpub]
          data.xpubs.forEach(key => {
            if (key.value) {
              data.rootXpubs.push(key.value)
            }
          })
          delete data.xpubs
        }

        const accountData = {
          'root_xpubs':data.rootXpubs,
          'quorum':  parseInt(data.quorum),
          'alias': data.alias}

        return chainClient().accounts.create(accountData)
          .then((resp) => {
            if (resp.status === 'fail') {
              throw resp
            }

            if(resp.status === 'success') {
              dispatch({type: 'SET_CURRENT_ACCOUNT', account: resp.data.alias})
              dispatch(createSuccess() )
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
  createSuccess,
  setMiningAddress
}

export default actions
