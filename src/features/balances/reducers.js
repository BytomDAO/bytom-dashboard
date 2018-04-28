import { combineReducers } from 'redux'

const itemsReducer = (state = {}, action) => {
  if (action.type == 'APPEND_BALANCE_PAGE') {
    const newState = {}
    action.param.data.forEach((item, index) => {
      const id = `balance-${index}`
      newState[id] = {
        id: `balance-${index}`,
        ...item
      }
    })

    return newState
  }
  return state
}

const queriesReducer = (state = {}, action) => {
  if (action.type == 'APPEND_BALANCE_PAGE') {
    return {
      loadedOnce: true
    }
  }

  return state
}


export default combineReducers({
  items: itemsReducer,
  queries: queriesReducer
})
