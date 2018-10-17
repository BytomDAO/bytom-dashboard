import { List, New, AssetShow, AssetUpdate } from './components'
import { makeRoutes } from 'features/shared'

export default (store) => {
  const routes = makeRoutes(store, 'asset', List, New, AssetShow)
  routes.childRoutes.push({
    path: ':id/alias',
    component: AssetUpdate
  })

  return routes
}
