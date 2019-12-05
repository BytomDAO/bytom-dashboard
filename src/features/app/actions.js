import { push } from 'react-router-redux'
import { chainClient } from 'utility/environment'

const actions = {
  dismissFlash: (param) => ({type: 'DISMISS_FLASH', param}),
  displayedFlash: (param) => ({type: 'DISPLAYED_FLASH', param}),
  updateAccountInit: (param) => ({type: 'UPDATE_ACCOUNT_INIT_STATUS', param}),
  showModal: (body, accept, cancel, options = {}) => ({type: 'SHOW_MODAL', payload: { body, accept, cancel, options }}),
  hideModal: { type: 'HIDE_MODAL' },
  showNavAdvanced: { type: 'SHOW_NAV_ADVANCE' },
  hideNavAdvanced: (dispatch, getState) => {
    if (getState().app.navAdvancedState === 'advance' ) {
      dispatch({ type: 'HIDE_NAV_ADVANCE' })
    }
  },
  showRoot: push('/transactions'),
  toggleDropdown: { type: 'TOGGLE_DROPDOWN' },
  closeDropdown: (dispatch, getState) => {
    if (getState().app.dropdownState === 'open') {
      dispatch({ type: 'CLOSE_DROPDOWN' })
    }
  },
  showInitialization: () => {
    return (dispatch, getState) => {
      // Need a default here, since locationBeforeTransitions gets cleared
      // during logout.
      let pathname = (getState().routing.locationBeforeTransitions || {}).pathname

      if (!(pathname.indexOf('initialization') >= 0)) {
        dispatch(push('/initialization'))
      }
    }
  },
  showConfiguration: () => {
    return (dispatch, getState) => {
      // Need a default here, since locationBeforeTransitions gets cleared
      // during logout.
      let pathname = (getState().routing.locationBeforeTransitions || {}).pathname

      if (pathname !== 'configuration') {
        dispatch(push('/configuration'))
      }
    }
  },
  cmd: (data) => () => {
    return chainClient().bytomCli.request(data)
  }
}

export default actions
