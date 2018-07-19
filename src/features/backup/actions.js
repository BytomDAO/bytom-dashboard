import { chainClient } from 'utility/environment'

let actions = {
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
        .catch(err => {
          dispatch({type: 'ERROR', payload: err})
        })
    }
  },

}

export default actions
