import { chainClient } from 'utility/environment'
import { push } from 'react-router-redux'

export default function(type, options = {}) {
  const updated = (param) => ({ type: `UPDATED_${type.toUpperCase()}`, param })

  return {
    updated,
    submitUpdateForm: (data, id) => {
      const clientApi = options.clientApi ? options.clientApi() : chainClient()[`${type}s`]
      let promise = Promise.resolve()

      return function(dispatch) {
        return promise.then(() => clientApi.updateAlias({
          id: id,
          alias: data.alias,
        }).then((resp) => {
          if (resp.status === 'fail') {
            throw new Error(resp.msg)
          }
          dispatch(updated(resp))

          dispatch(push({
            pathname: `/${type}s/${id}`,
            state: {
              preserveFlash: true
            }
          }))
        }))
      }
    }
  }
}
