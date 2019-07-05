import { chainClient } from 'utility/environment'
import { baseCreateActions, baseUpdateActions, baseListActions } from 'features/shared/actions'

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
  setDefaultAccount
}

export default actions
