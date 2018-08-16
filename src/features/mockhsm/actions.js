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

const resetPassword = {
  submitResetForm: (params) => {
    let promise = Promise.resolve()
    return (dispatch)  => {
      return promise.then(() => clientApi().resetPassword(params).then((resp) => {
        if(resp.data.changed){
          dispatch({ type: `RESET_PASSWORD_${type.toUpperCase()}`, resp })
          dispatch(push({
            pathname: `/${type}s/${params.xpub}`,
            state: {
              preserveFlash: true
            }
          }))
        }else{
          let msg = 'Unable to reset the key password.'
          throw new Error(msg)
        }
      }))
    }
  }
}

const checkPassword = (data) => (dispatch) => {
  return clientApi().checkPassword(data)
    .then((resp) => {
      if(resp.status === 'fail'){
        throw new Error(resp.msg)
      }else if(!resp.data.checkResult){
        throw new Error('Your Password is wrong')
      }
      dispatch({ type: 'KEY_PASSWORD_SUCCESS'})
    })
}

const createExport =  (arg, fileName) => (dispatch) => {
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

export default {
  ...create,
  ...list,
  ...resetPassword,
  checkPassword,
  createExport
}
