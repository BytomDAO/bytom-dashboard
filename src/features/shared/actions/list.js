import { chainClient } from 'utility/environment'
import { push, replace } from 'react-router-redux'

export default function(type, options = {}) {
  const listPath  = options.listPath || `/${type}s`
  const clientApi = () => options.clientApi ? options.clientApi() : chainClient()[`${type}s`]

  const receive = (param) => ({
    type: `RECEIVED_${type.toUpperCase()}_ITEMS`,
    param,
  })

  // Dispatch a single request for the specified query, and persist the
  // results to the default item store
  const fetchItems = (params) => {
    const requiredParams = options.requiredParams || {}

    params = { ...params, ...requiredParams }

    return (dispatch) => {
      const promise = clientApi().query(params)

      promise.then(
        (resp) => {
          if(resp.status == 'fail'){
            dispatch({type: 'ERROR', payload: { 'message': resp.msg}})
          }else{
            dispatch(receive(resp))
          }
        }
      )

      return promise
    }
  }

  // Fetch all items up to the specified page, and persist the results to
  // the filter-specific store
  const fetchPage = (query, pageNumber = 1, options = {}) => {
    const listId =  query.filter || ''
    pageNumber = parseInt(pageNumber || 1)

    return (dispatch, getState) => {
      const getFilterStore = () => getState()[type].queries[listId] || {}

      options.pageNumber = pageNumber

      const fetchNextPage = () =>
        dispatch(_load(query, getFilterStore(), options)).then((resp) => {
          if (!resp || resp.type == 'ERROR') return

          return Promise.resolve(resp)
        })

      return dispatch(fetchNextPage)
    }
  }

  // Fetch and persist all records of the current object type
  const fetchAll = () => {
    return fetchPage('', -1)
  }

  const _load = function(query = {}, list = {}, requestOptions) {
    return function(dispatch) {
      const latestResponse = list.cursor || null
      const refresh = requestOptions.refresh || false

      if (!refresh && latestResponse && latestResponse.lastPage) {
        return Promise.resolve({last: true})
      }

      let promise
      const filter = query.filter || ''

      if (!refresh && latestResponse) {
        let responsePage
        promise = latestResponse.nextPage()
          .then(resp => {
            responsePage = resp
            return dispatch(receive(responsePage))
          }).then(() =>
            responsePage
          )
      } else {
        const params = {}
        if (query.filter) params.filter = filter
        if (query.sumBy) params.sumBy = query.sumBy.split(',')

        if(requestOptions.pageNumber !== -1){
          const count = requestOptions.pageSize
          const from = ( count ) * ( requestOptions.pageNumber -1 )
          params.from = from
          params.count = count
        }

        promise = dispatch(fetchItems(params))
      }

      return promise.then((response) => {
        return dispatch({
          type: `APPEND_${type.toUpperCase()}_PAGE`,
          param: response,
          refresh: refresh,
        })
      }).catch(err => {
        return dispatch({type: 'ERROR', payload: err})
      })
    }
  }

  const deleteItem = (id, confirmMessage, deleteMessage) => {
    return (dispatch) => {
      if (!window.confirm(confirmMessage)) {
        return
      }

      clientApi().delete(id)
        .then(() => dispatch({
          type: `DELETE_${type.toUpperCase()}`,
          id: id,
          message: deleteMessage,
        })).catch(err => dispatch({
          type: 'ERROR', payload: err
        }))
    }
  }

  const pushList = (query = {}, pageNumber, options = {}) => {
    if (pageNumber) {
      query = {
        ...query,
        page: pageNumber,
      }
    }

    const location = {
      pathname: listPath,
      query
    }

    if (options.replace) return replace(location)
    return push(location)
  }

  return {
    fetchItems,
    fetchPage,
    fetchAll,
    deleteItem,
    pushList,
    didLoadAutocomplete: {
      type: `DID_LOAD_${type.toUpperCase()}_AUTOCOMPLETE`
    },
  }
}
