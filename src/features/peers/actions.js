import { baseListActions } from 'features/shared/actions'
import { chainClient } from 'utility/environment'
import {push} from 'react-router-redux'

const disconnect = (id) => {
  return (dispatch) => {
    return chainClient().peers.disconnect({peer_id: id})
      .then((resp) => {
        if(resp.status == 'fail'){
          dispatch({type: 'ERROR', payload: { 'message': resp.msg}})
        }
      })
      .catch((err) => {
        if (!err.status) {
          dispatch({type: 'ERROR', payload: { 'message': err}})
        }
      })
  }
}

let actions = {
  disconnect,
  ...baseListActions('peer')
}

export default actions
