import { reducers } from 'features/shared'
import { combineReducers } from 'redux'

const type = 'transaction'
const maxGeneratedHistory = 50

export const statusReducer = (state = {}, action) => {
  if (action.type === 'RECEIVED_TRANSACTION_ITEMS') {
    const data = action.param.data
    return {
      page: data.page,
      totalPage: data.totalPage
    }
  }
  return state
}

export default combineReducers({
  items: reducers.itemsReducer(type),
  status: statusReducer,
  queries: reducers.queriesReducer(type),
  generated: (state = [], action) => {
    if (action.type == 'GENERATED_TX_HEX') {
      return [action.generated, ...state].slice(0, maxGeneratedHistory)
    }
    return state
  },
})
