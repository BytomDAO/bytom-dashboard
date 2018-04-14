import { List, New, Show } from './components'
import { makeRoutes } from 'features/shared'

export default (store) => makeRoutes(store, 'key', List, New, Show, null, { skipFilter: true, name: 'Keys', name_zh:'密钥' })
