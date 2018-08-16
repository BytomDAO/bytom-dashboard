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
      return 'Your key password is correct.'
    }
    if(action.type == 'redux-form/CHANGE'){
      return ''
    }
    return state
  },
})
