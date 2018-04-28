import { combineReducers } from 'redux'
import moment from 'moment'

const defaultIdFunc = (item) => item.id

export const itemsReducer = (type, idFunc = defaultIdFunc) => (state = {}, action) => {
  if (action.type == `RECEIVED_${type.toUpperCase()}_ITEMS`) {
    const newObjects = {}

    const data = type.toUpperCase() !== 'TRANSACTION' ? action.param.data : action.param.data.map(data => ({
      ...data,
      id: data.txId,
      timestamp: data.blockTime,
      blockId: data.blockHash,
      position: data.blockIndex
    }));

    (data || []).forEach(item => {
      if (!item.id) { item.id = idFunc(item) }
      newObjects[idFunc(item)] = item
    })
    return newObjects
  } else if (action.type == `DELETE_${type.toUpperCase()}`) {
    delete state[action.id]
    return {...state}
  }
  return state
}

export const queryItemsReducer = (type, idFunc = defaultIdFunc) => (state = [], action) => {
  return state
}

export const queryCursorReducer = (type) => (state = {}, action) => {
  if (action.type == `APPEND_${type.toUpperCase()}_PAGE`) {
    return action.param
  }
  return state
}

export const queryTimeReducer = (type) => (state = '', action) => {
  if (action.type == `APPEND_${type.toUpperCase()}_PAGE`) {
    return moment().format('h:mm:ss a')
  }
  return state
}

export const autocompleteIsLoadedReducer = (type) => (state = false, action) => {
  if (action.type == `DID_LOAD_${type.toUpperCase()}_AUTOCOMPLETE`) {
    return true
  }

  return state
}

export const listViewReducer = (type, idFunc = defaultIdFunc) => combineReducers({
  itemIds: queryItemsReducer(type, idFunc),
  cursor: queryCursorReducer(type),
  queryTime: queryTimeReducer(type)
})

export const queriesReducer = (type) => (state = {}, action) => {
  if (action.type == `APPEND_${type.toUpperCase()}_PAGE`) {
    return {
      ...state,
      loadedOnce: true
    }
  }

  return state
}
