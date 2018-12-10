import { reducers } from 'features/shared'
import { combineReducers } from 'redux'

const type = 'peer'

const itemsReducer = (state = {}, action) => {
  if (action.type == 'RECEIVED_PEER_ITEMS') {
    return action.param.data
  }
  return state
}

export default combineReducers({
  items: itemsReducer,
  queries: reducers.queriesReducer(type)
})
