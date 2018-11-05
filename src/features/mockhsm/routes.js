import { List, New, Show, ResetPassword, CheckPassword, MnemonicStepper } from './components'
import { makeRoutes } from 'features/shared'

export default (store) => makeRoutes(store, 'key', List, New, Show,
  {
    childRoutes: [
      {
        path: ':id/reset-password',
        component: ResetPassword,
      },
      {
        path: ':id/check-password',
        component: CheckPassword,
      },
      {
        path: 'mnemonic',
        component: MnemonicStepper
      }
    ],skipFilter: true, name: 'key' })