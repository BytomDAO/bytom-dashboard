import { RoutingContainer } from 'features/shared/components'
import { Index, ElectronIndex } from './components'

export default {
  path: 'configuration',
  component: RoutingContainer,
  indexRoute: { component: process.env.TARGET === 'electron' ? ElectronIndex : Index }
}
