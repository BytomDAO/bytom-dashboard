import { combineReducers } from 'redux'

const mnemonic = (state = [], action) => {
  if (action.type == 'INIT_ACCOUNT') {
    return action.data
  }
  return state
}

export default combineReducers({
  mnemonic
})
