import { baseListActions, baseCreateActions, baseUpdateActions } from 'features/shared/actions'
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

const update = baseUpdateActions(type, {
  className: 'Key',
  clientApi,
})

create.submitForm = (data) => function (dispatch) {
  if (typeof data.alias == 'string')  data.alias = data.alias.trim()

  return clientApi().create(data)
    .then((resp) => {
      if (resp.status === 'fail') {
        throw resp
      }

      dispatch({type: 'NEW_KEY', data: resp.data.mnemonic})
      dispatch( push('/keys/mnemonic') )
    })
}

const resetPassword = {
  submitResetForm: (params) => {
    let promise = Promise.resolve()
    return (dispatch)  => {
      return promise.then(() => clientApi().resetPassword(params).then((resp) => {
        if(resp.data.changed){
          dispatch({ type: `RESET_PASSWORD_${type.toUpperCase()}`, resp })
          dispatch(push({
            pathname: '/accounts',
            state: {
              preserveFlash: true
            }
          }))
        }else{
          throw {code: 'F_BTM001'}
        }
      }))
    }
  }
}

const checkPassword = (data) => (dispatch) => {
  return clientApi().checkPassword(data)
    .then((resp) => {
      if(resp.status === 'fail'){
        throw resp
      }else if(!resp.data.checkResult){
        throw {code: 'F_BTM000'}
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

const createSuccess = ()=> (dispatch) =>{
  dispatch(create.created())
  dispatch(push('/keys'))
}

export default {
  ...create,
  ...list,
  ...update,
  ...resetPassword,
  checkPassword,
  createExport,
  createSuccess
}
