import { RoutingContainer } from 'features/shared/components'
import { humanize } from 'utility/string'
import actions from 'actions'

const makeRoutes = (store, type, List, New, Show, options = {}) => {
  const loadPage = (nextState) => {
    if (type === 'transaction' &&
      nextState.location.query) {
      const page = typeof nextState.location.query.page === 'number' ? nextState.location.query.page : 1
      store.dispatch(actions[type].fetchPage(nextState.location.query, page))
    } else {
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
      onChange: (_, nextState, replace) => {
        loadPage(nextState, replace)
      }
    },
    childRoutes: childRoutes
  }
}

export default makeRoutes
