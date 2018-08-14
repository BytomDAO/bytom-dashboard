import { reducers } from 'features/shared'
import { combineReducers } from 'redux'

const type = 'transaction'
const maxGeneratedHistory = 50

const decodedTx = (state = [], action) => {
  if (action.type == 'DECODE_TRANSACTION') {
    return action.data
  }
  return state
}

export default combineReducers({
  items: reducers.itemsReducer(type),
  queries: reducers.queriesReducer(type),
  generated: (state = [], action) => {
    if (action.type == 'GENERATED_TX_HEX') {
      return [action.generated, ...state].slice(0, maxGeneratedHistory)
    }
    return state
  },
  decodedTx
})
