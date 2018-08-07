import { RoutingContainer } from 'features/shared/components'
import { humanize } from 'utility/string'
import { UTXOpageSize, pageSize } from 'utility/environment'
import actions from 'actions'

const makeRoutes = (store, type, List, New, Show, options = {}) => {
  const loadPage = ( state ) => {
    if(type === 'transaction' || type === 'unspent'){
      const query = state.location.query
      const pageNumber = parseInt(state.location.query.page || 1)
      const pageSizes = (type === 'unspent')? UTXOpageSize: pageSize
      if (pageNumber == 1) {
        store.dispatch(actions[type].fetchPage(query, pageNumber, { refresh: true, pageSize: pageSizes }))
      } else {
        store.dispatch(actions[type].fetchPage(query, pageNumber,  { pageSize: pageSizes }))
      }
    }else{
      store.dispatch(actions[type].fetchAll())
    }
  }

  const childRoutes = []

  if (New) {
    childRoutes.push({
      path: 'create',
      component: New
    })
  }

  if (options.childRoutes) {
    childRoutes.push(...options.childRoutes)
  }

  if (Show) {
    childRoutes.push({
      path: ':id',
      component: Show
    })
  }

  return {
    path: options.path || type + 's',
    component: RoutingContainer,
    name: options.name || humanize(type + 's'),
    name_zh: options.name_zh,
    indexRoute: {
      component: List,
      onEnter: (nextState, replace) => {
        loadPage(nextState, replace)
      },
      onChange: (_, nextState, replace) => { loadPage(nextState, replace) }
    },
    childRoutes: childRoutes
  }
}

export default makeRoutes
