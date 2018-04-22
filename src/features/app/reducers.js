import React from 'react'
import { combineReducers } from 'redux'
import uuid from 'uuid'

const flash = (message, title, type) => ({ message, title, type, displayed: false })
const newFlash = (state, f) => ({...state, [uuid.v4()]: f})
const newSuccess = (state, message, title) => ({...state, [uuid.v4()]: flash(message, title, 'success')})
const newError = (state, message, title) => ({...state, [uuid.v4()]: flash(message, title, 'danger')})

export const flashMessages = (state = {}, action) => {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE': {
      if (action.payload.state && action.payload.state.preserveFlash) {
        return state
      } else {
        Object.keys(state).forEach(key => {
          const item = state[key]
          if (item.displayed) {
            delete state[key]
          }
        })
        return {...state}
      }
    }

    case 'CREATED_ACCOUNT': {
      return newSuccess(state, 'CREATED_ACCOUNT')
    }

    case 'CREATED_ASSET': {
      return newSuccess(state, 'CREATED_ASSET')
    }

    case 'CREATED_TRANSACTION': {
      return newSuccess(state, 'CREATED_TRANSACTION')
    }

    case 'CREATED_KEY': {
      return newSuccess(state, 'CREATED_KEY')
    }

    case 'CREATED_TRANSACTIONFEED': {
      return newSuccess(state, <p>
        Created transaction feed.
      </p>)
    }

    case 'CREATED_TOKEN_WITH_GRANT': {
      return newSuccess(state, <p>
        Access token has been created successfully.
      </p>)
    }

    case 'CREATED_X509_GRANT': {
      return newSuccess(state, <p>
        Granted policy to X509 certificate.
      </p>)
    }

    case 'RESET_PASSWORD_KEY': {
      return newSuccess(state, 'RESET_PASSWORD_KEY')
    }

    case 'DELETE_ACCESS_TOKEN':
    case 'DELETE_TRANSACTIONFEED': {
      return newFlash(state, flash(action.message, null, 'info'))
    }

    case 'DISMISS_FLASH': {
      delete state[action.param]
      return {...state}
    }

    case 'DISPLAYED_FLASH': {
      const existing = state[action.param]
      if (existing && !existing.displayed) {
        const newState = {...state}
        existing.displayed = true
        newState[action.param] = existing
        return newState
      }
      return state
    }

    case 'UPDATED_ACCOUNT': {
      return newSuccess(state, <p>
          Updated account tags.
        </p>)
    }

    case 'UPDATED_ASSET': {
      return newSuccess(state, 'UPDATED_ASSET')
    }

    case 'CREATE_REGISTER_ACCOUNT': {
      return newSuccess(state, 'CREATE_REGISTER_ACCOUNT')
    }

    case 'ERROR': {
      return newError(state, action.payload.message)
    }

    case 'USER_LOG_IN': {
      return {}
    }

    case 'RESTORE_SUCCESS': {
      return newSuccess(state, 'RESTORE_SUCCESS')
    }

    default: {
      return state
    }
  }
}

export const modal = (state = { isShowing: false }, action) => {
  if      (action.type == 'SHOW_MODAL') return { isShowing: true, ...action.payload }
  else if (action.type == 'HIDE_MODAL') return { isShowing: false }
  return state
}

export const navAdvancedState = (state = 'normal', action) => {
  if (action.type == 'SHOW_NAV_ADVANCE') {
    return state === 'normal' ? 'advance' : 'normal'
  } else if (action.type == 'HIDE_NAV_ADVANCE') {
    return 'normal'
  }
  return state
}

export const dropdownState = (state = '', action) => {
  if (action.type == 'TOGGLE_DROPDOWN') {
    return state === '' ? 'open' : ''
  } else if (action.type == 'CLOSE_DROPDOWN') {
    return ''
  }

  return state
}

export default combineReducers({
  flashMessages,
  modal,
  dropdownState,
  navAdvancedState
})
