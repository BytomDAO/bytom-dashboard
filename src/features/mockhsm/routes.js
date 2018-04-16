import { List, New, Show, ResetPassword } from './components'
import { makeRoutes } from 'features/shared'

export default (store) => makeRoutes(store, 'key', List, New, Show,
  {
    childRoutes: [
      {
        path: ':id/reset-password',
        component: ResetPassword,
      },
    ],skipFilter: true, name: 'Keys', name_zh:'密钥' })