import { chainClient, UTXOpageSize } from 'utility/environment'
import { push, replace } from 'react-router-redux'

export default function(type, options = {}) {
  const listPath  = options.listPath || `/${type}s`
  const clientApi = () => options.clientApi ? options.clientApi() : chainClient()[`${type}s`]

  const receive = (param) => ({
    type: `RECEIVED_${type.toUpperCase()}_ITEMS`,
    param,
  })

  const updateIdArray = (param) => ({
    type: 'UPDATE_TRANSACTION_ID_ARRAY',
    data: param
  })

  const updateUnconfirmed = () => ({
    type: 'UPDATE_CONFIRM_PARAMS',
  })

  const updateMixedPageNo = (param) => ({
    type: 'UPDATE_MIXED_PAGES_NUMBER_PARAMS',
    data: param
  })

  const updateId = (arrayList, options) => {
    if(arrayList.length !== 0){
      const txId = arrayList[arrayList.length-1].txId
      const pageIds = options.pageIds
      if(options && options.pageNumber === 1){
        return [txId]
      }else if(options && options.pageNumber > 1){
        pageIds[options.pageNumber-1] = txId
      }
      return pageIds
    }else{
      return []
    }
  }

  // Dispatch a single request for the specified query, and persist the
  // results to the default item store
  const fetchItems = (params, requestOptions) => {
    const requiredParams = options.requiredParams || {}

    params = { ...params, ...requiredParams }

    return (dispatch) => {
      const promise = clientApi().query(params)

      promise.then(
        (resp) => {
          if(resp.status == 'fail'){
            dispatch({type: 'ERROR', payload: { 'message': resp.msg}})
          }else{
            if(type === 'transaction'){
              const result = resp.data
              let response = resp
              if(requestOptions.unconfirmed &&result.length<requestOptions.pageSize ) {
                params.unconfirmed = false
                params.count = params.count - result.length
                delete params.startTxId
                return clientApi().query(params).then(
                  (resp1) => {
                    if (resp1.status == 'fail') {
                      dispatch({type: 'ERROR', payload: {'message': resp1.msg}})
                    } else {
                      dispatch(updateMixedPageNo(requestOptions.pageNumber))
                      response.data = result.concat(resp1.data)
                      dispatch(updateIdArray(updateId(response.data, requestOptions)))
                      dispatch(receive(response))
                      dispatch(updateUnconfirmed())
                    }
                  }
                )
              }else{
                dispatch(updateIdArray(updateId(response.data, requestOptions)))
                dispatch(receive(resp))
              }
            }else{
              dispatch(receive(resp))
            }
          }
        }
      ).catch(error=>{
        if(error.body){
          dispatch({type: 'ERROR', payload: { 'message': error.body.msg}})
        }
        else throw error
      })

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
      if(type === 'transaction'){
        options.pageIds = getState()[type].pageIds || []
        options.mixPageNo = getState()[type].mixPageNo || 0
      }

      const fetchNextPage = () =>
        dispatch(_load(query, getFilterStore(), options)).then((resp) => {
          if (!resp || resp.type == 'ERROR') return

          return Promise.resolve(resp)
        })

      return dispatch(fetchNextPage)
    }
  }

  // Fetch and persist all records of the current object type
  const fetchAll = (obj) => {
    return fetchPage('', -1, obj)
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
      const unconfirmed = requestOptions.unconfirmed || true
      const accountAlias = requestOptions.accountAlias || ''

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
        if (requestOptions.accountAlias) params.accountAlias = accountAlias
        if (requestOptions.unconfirmed) params.unconfirmed = unconfirmed
        if (query.sumBy) params.sumBy = query.sumBy.split(',')

        if(requestOptions.pageNumber !== -1){
          const count = requestOptions.pageSize
          params.count = count
          if( type === 'transaction' &&  requestOptions.mixPageNo === requestOptions.pageNumber){
            params.unconfirmed = requestOptions.unconfirmed = true
          }
          if( type === 'transaction' && requestOptions.pageNumber > 1 ){
            params.from = (requestOptions.pageNumber - 1) * 25
            // params.startTxId = requestOptions.pageIds[requestOptions.pageNumber-2]
          }
          if(type === 'unspent'){
            params.from = (requestOptions.pageNumber-1)*UTXOpageSize
          }
        }
        promise = dispatch(fetchItems(params, requestOptions))
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
