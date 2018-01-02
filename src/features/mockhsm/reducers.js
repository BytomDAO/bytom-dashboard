import { reducers } from 'features/shared'
import { combineReducers } from 'redux'

const type = 'key'
const idFunc = item => item.xpub

export default combineReducers({
  items: reducers.itemsReducer(type, idFunc),
  queries: reducers.queriesReducer(type, idFunc),
  autocompleteIsLoaded: reducers.autocompleteIsLoadedReducer(type),
})
