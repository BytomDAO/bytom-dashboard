import { chainClient } from 'utility/environment'

const updateInfo = (param) => ({type: 'UPDATE_CORE_INFO', param})
const setClientToken = (token) => ({type: 'SET_CLIENT_TOKEN', token})
const clearSession = ({ type: 'USER_LOG_OUT' })
const updateBTMAmountUnit = (param) => ({type: 'UPDATE_BTM_AMOUNT_UNIT', param})
const updateLang = (param) => ({type: 'UPDATE_CORE_LANGUAGE', lang:param})

const updateMiningState = (param) => {
  return (dispatch) => {
    return chainClient().config.mining(param)
      .then(() => {
        dispatch({type: 'UPDATE_MINING_STATE', param})
      })
      .catch((err) => {
        if (!err.status) {
          throw err
        }
      })
  }
}

const fetchCoreInfo = (options = {}) => {
  return (dispatch) => {
    return chainClient().config.info()
      .then((info) => {
        dispatch(updateInfo(info))
      })
      .catch((err) => {
        if (options.throw || !err.status) {
          throw err
        } else {
          if (err.status == 401) {
            dispatch({type: 'ERROR', payload: err})
          } else {
            dispatch({type: 'CORE_DISCONNECT'})
          }
        }
      })
  }
}

//todo: change the function later
const registerKey = (data) => {
  return (dispatch) => {
    if (typeof data.keyAlias == 'string')  data.keyAlias = data.keyAlias.trim()

    const keyData = {
      'alias': data.keyAlias,
      'password': data.password
    }
    return chainClient().mockHsm.keys.create(keyData)
      .then((resp) => {
        if (resp.status === 'fail') {
          throw new Error(resp.msg)
        }

        if (typeof data.accountAlias == 'string')  data.accountAlias = data.accountAlias.trim()
        const accountData = {
          'root_xpubs':[resp.data.xpub],
          'quorum':1,
          'alias': data.accountAlias}

        dispatch({type: 'CREATE_REGISTER_KEY', data})
        chainClient().accounts.create(accountData)
          .then((resp) => {
            if (resp.status === 'fail') {
              throw new Error(resp.msg)
            }

            if(resp.status === 'success') {
              dispatch({type: 'CREATE_REGISTER_ACCOUNT', resp})
            }
          })
          .catch((err) => {
            if (!err.status) {
              throw err
            }
          })
      })
      .catch((err) => {
        if (!err.status) {
          throw err
        }
      })
  }
}

let actions = {
  setClientToken,
  updateInfo,
  updateBTMAmountUnit,
  updateLang,
  updateMiningState,
  fetchCoreInfo,
  clearSession,
  registerKey,
  logIn: (token) => (dispatch) => {
    dispatch(setClientToken(token))
    return dispatch(fetchCoreInfo({throw: true}))
      .then(() => dispatch({type: 'USER_LOG_IN'}))
  }
}

export default actions
