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
  switchAccount
}

export default actions
