import { baseListActions, baseCreateActions } from 'features/shared/actions'
import { chainClient } from 'utility/environment'
import {push} from 'react-router-redux'

const type = 'key'
const clientApi = () => chainClient().mockHsm.keys

const list = baseListActions(type, {
  className: 'Key',
  clientApi,
})
const create = baseCreateActions(type, {
  className: 'Key',
  clientApi,
})

const reset = {
  submitResetForm: (params) => {
    return (dispatch)  => {
      return clientApi().resetPassword(params).then((resp) => {
        if(resp.data.changed){
          dispatch({ type: `RESET_PASSWORD_${type.toUpperCase()}`, resp })
        }else{
          dispatch({ type: 'ERROR', payload: {message: 'Unable to reset the key password.'} })
        }

        dispatch(push({
          pathname: `/${type}s/${id}`,
          state: {
            preserveFlash: true
          }
        }))
      })
    }
  }
}

export default {
  ...create,
  ...list,
  ...reset,
  createExport: (arg, fileName) => (dispatch) => {
    clientApi().export(arg).then(resp => {
      if(resp.status == 'success'){
        const privateKey = resp.data.privateKey

        var element = document.createElement('a')
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(privateKey))
        element.setAttribute('download', fileName)
        element.style.display = 'none'
        document.body.appendChild(element)
        element.click()

        document.body.removeChild(element)
      }else if(resp.status == 'fail'){
        dispatch({ type: 'ERROR', payload: {message: resp.msg} })
      }
    })
  }
}
