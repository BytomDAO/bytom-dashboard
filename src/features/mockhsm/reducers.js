import { reducers } from 'features/shared'
import { combineReducers } from 'redux'

const type = 'key'
const idFunc = item => item.xpub

const importStatusReducer = (state = [], action) => {
  if (action.type === 'RECEIVED_IMPORT_STATUS') {
    return action.data
  }

  return state
}

export default combineReducers({
  items: reducers.itemsReducer(type, idFunc),
  queries: reducers.queriesReducer(type, idFunc),
  autocompleteIsLoaded: reducers.autocompleteIsLoadedReducer(type),
  importStatus: importStatusReducer,
})
