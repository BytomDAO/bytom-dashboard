import { combineReducers } from 'redux'
import { reducers } from 'features/shared'

const type = 'balance'
const idFunc = (item, index) => index

const itemsReducer = (state = {}, action) => {
  if (action.type == 'APPEND_BALANCE_PAGE') {
    const newState = {}
    let count = 0
    action.param.data.forEach((item) => {
      const accountId = item.id
      const accountAlias = item.alias;
      (item.balances || []).map(balance => {
        const id = `balance-${count++}`
        newState[id] = {
          id,
          accountAlias,
          accountId: accountId,
          ...balance
        }
      })
    })

    return newState
  }
  return state
}

const listViewReducer = combineReducers({
  itemIds: reducers.queryItemsReducer(type, idFunc),
  cursor: reducers.queryCursorReducer(type),
  queryTime: reducers.queryTimeReducer(type),
})

const queriesReducer = (state = {}, action) => {
  if (action.type == 'APPEND_BALANCE_PAGE') {
    const query = action.param.next.filter || ''
    const list = state[query] || {}

    return {
      [`${query}`]: listViewReducer(list, action)
    }
  }

  return state
}


export default combineReducers({
  items: itemsReducer,
  queries: queriesReducer
})
