import { RoutingContainer } from 'features/shared/components'
import { Index, Register, Restore, RestoreMnemonic, RestoreKeystore, MnemonicStepper } from './components'

export default {
  path: 'initialization',
  component: RoutingContainer,
  indexRoute: { component: Index },
  childRoutes: [
    {
      path: 'register',
      component: Register
    },
    {
      path: 'mnemonic',
      component: MnemonicStepper
    },
    {
      path: 'restore',
      component: Restore
    },
    {
      path: 'restoreMnemonic',
      component: RestoreMnemonic
    },
    {
      path: 'restoreKeystore',
      component: RestoreKeystore
    }
  ]
}
