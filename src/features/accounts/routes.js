import { List, New, AccountShow, AccountUpdate } from './components'
import { makeRoutes } from 'features/shared'

export default (store) => {
  const routes = makeRoutes(store, 'account', List, New, AccountShow)
  routes.childRoutes.push({
    path: ':id/alias',
    component: AccountUpdate
  })

  return routes
}

