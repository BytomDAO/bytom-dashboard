import { RoutingContainer } from 'features/shared/components'
import { Index, Register, Restore, Mnemonic, Keystore, MnemonicStepper } from './components'

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
      component: Mnemonic
    },
    {
      path: 'restoreKeystore',
      component: Keystore
    }
  ]
}
