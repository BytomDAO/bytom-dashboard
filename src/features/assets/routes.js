import { List, New, AssetShow, AssetUpdate } from './components'
import { makeRoutes } from 'features/shared'

export default (store) => {
  const routes = makeRoutes(store, 'asset', List, New, AssetShow, {name_zh: '资产'})
  routes.childRoutes.push({
    path: ':id/alias',
    component: AssetUpdate
  })

  return routes
}
