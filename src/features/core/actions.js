import { chainClient } from 'utility/environment'

const updateInfo = (param) => ({type: 'UPDATE_CORE_INFO', param})
const setClientToken = (token) => ({type: 'SET_CLIENT_TOKEN', token})
const clearSession = ({ type: 'USER_LOG_OUT' })
const updateBTMAmountUnit = (param) => ({type: 'UPDATE_BTM_AMOUNT_UNIT', param})
const updateConfiguredStatus = ({ type: 'SET_CONFIGURED' })

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
    // return chainClient().config.info()
    // .then((info) => {
    //   console.log(info);
    //   dispatch(updateInfo(info))
    // })
    return Promise.all([
      chainClient().config.info(),
      chainClient().config.chainStatus()
    ])
      .then(([info, status]) => {
        info.data.finalizedBlock = status.data.finalizedHeight
        info.data.justifiedBlock = status.data.justifiedHeight
        info.data.currentBlock = status.data.currentHeight
        info.data.highestBlock = info.data.highestHeight
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


let actions = {
  setClientToken,
  updateInfo,
  updateBTMAmountUnit,
  updateMiningState,
  updateConfiguredStatus,
  fetchCoreInfo,
  clearSession,
  logIn: (token) => (dispatch) => {
    dispatch(setClientToken(token))
    return dispatch(fetchCoreInfo({throw: true}))
      .then(() => dispatch({type: 'USER_LOG_IN'}))
  }
}

export default actions
