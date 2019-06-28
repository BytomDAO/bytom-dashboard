import { combineReducers } from 'redux'

const itemsReducer = (state = {}, action) => {
  if (action.type == 'APPEND_FEDERATION_PAGE') {
    const newState = {}
    action.param.result.data.forEach((item, index) => {
      const id = `federation-${index}`
      newState[id] = {
        id: `federation-${index}`,
        ...item
      }
    })

    return newState
  }
  return state
}

const queriesReducer = (state = {}, action) => {
  if (action.type == 'APPEND_FEDERATION_PAGE') {
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
