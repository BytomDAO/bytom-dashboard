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

const pageIds = (state = [], action) => {
  if (action.type == 'UPDATE_TRANSACTION_ID_ARRAY') {
    return action.data
  }
  return state
}

const unconfirm = (state = true, action) => {
  if (action.type == 'UPDATE_CONFIRM_PARAMS') {
    return false
  }
  return state
}

const mixPageNo = (state = 0, action) => {
  if (action.type == 'UPDATE_MIXED_PAGES_NUMBER_PARAMS') {
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
  decodedTx,
  pageIds,
  unconfirm,
  mixPageNo
})
