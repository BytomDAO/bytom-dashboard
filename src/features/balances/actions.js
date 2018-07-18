import { baseListActions } from 'features/shared/actions'
import { chainClient } from 'utility/environment'

const updateInfo = (param) => ({type: 'UPDATE_WALLET_INFO', param})

const rescan = () => {
  return (dispatch) => {
    return chainClient().backUp.rescan()
      .then((resp) => {
        if (resp.status === 'fail') {
          dispatch({type: 'ERROR', payload: {'message': resp.msg}})
        } else {
          dispatch({type: 'START_RESCAN'})
        }
      })
      .catch(err => {
        throw {_error: err}
      })
  }
}

const walletInfo = () => {
  return (dispatch) => {
    return chainClient().backUp.info()
      .then((info) => {
        if (info.status === 'fail') {
          dispatch({type: 'ERROR', payload: {'message': info.msg}})
        } else {
          if (info.data.bestBlockHeight === info.data.walletHeight) {
            dispatch({type: 'STOP_RESCAN'})
          }else{
            dispatch(updateInfo(info.data))
          }
        }
      })
      .catch((err) => {
        dispatch({type: 'ERROR', payload: err})
      })
  }
}

let actions = {
  updateInfo,
  rescan,
  walletInfo,
  ...baseListActions('balance')
}
export default actions
