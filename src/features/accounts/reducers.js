import { reducers } from 'features/shared'
import { combineReducers } from 'redux'

const type = 'account'

export const currentAccount = (state = '', action) => {
  if (action.type == 'SET_CURRENT_ACCOUNT') {
    window.currentAccount = {
      accountAlias: action.account,
      xpubs: action.xpubs
    }
    return action.account
  }
  return state
}

export default combineReducers({
  items: reducers.itemsReducer(type),
  queries: reducers.queriesReducer(type),
  autocompleteIsLoaded: reducers.autocompleteIsLoadedReducer(type),
  currentAccount
})
