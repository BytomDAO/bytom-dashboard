import { List, New, AccountShow, AccountUpdate, ResetPassword, CheckPassword, MnemonicStepper } from './components'
import { makeRoutes } from 'features/shared'

export default (store) => {
  const routes = makeRoutes(store, 'account', List, New, AccountShow,
    {
      childRoutes:[
        {
          path: ':id/alias',
          component: AccountUpdate
        },{
          path: 'key/reset-password/:id',
          component: ResetPassword,
        },
        {
          path: 'key/check-password/:id',
          component: CheckPassword,
        },{
          path: 'mnemonic',
          component: MnemonicStepper
        }]
    })

  return routes
}

