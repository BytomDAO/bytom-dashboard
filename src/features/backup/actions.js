import { chainClient } from 'utility/environment'

let actions = {
  rescan: () => {
    return (dispatch) => {
      return chainClient().backUp.rescan()
        .then((resp) => {
          if (resp.status === 'fail') {
            dispatch({type: 'ERROR', payload: { 'message': resp.msg}})
          }else {
            dispatch({type: 'START_RESCAN'})
          }
        })
        .catch(err => { throw {_error: err} })
    }
  },

  restore: (backupData) => {
    return (dispatch) => {
      return chainClient().backUp.restore(backupData)
        .then(resp => {
          if (resp.status === 'fail') {
            dispatch({type: 'ERROR', payload: { 'message': resp.msg}})
          }else {
            dispatch({type: 'RESTORE_SUCCESS'})
          }
        })
        .catch(err => { throw {_error: err} })
    }
  },

}

export default actions
