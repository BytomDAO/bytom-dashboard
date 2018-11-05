import { reducers } from 'features/shared'
import { combineReducers } from 'redux'

const type = 'key'
const idFunc = item => item.xpub

export default combineReducers({
  items: reducers.itemsReducer(type, idFunc),
  queries: reducers.queriesReducer(type, idFunc),
  autocompleteIsLoaded: reducers.autocompleteIsLoadedReducer(type),
  success: (state = '', action) => {
    if (action.type == 'KEY_PASSWORD_SUCCESS') {
      return 'F_BTM002'
    }
    if(action.type == 'redux-form/CHANGE'){
      return ''
    }
    return state
  },
  mnemonic: (state = [], action) => {
    if (action.type == 'NEW_KEY') {
      return action.data
    }
    return state
  },
})
