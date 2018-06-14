import { RoutingContainer } from 'features/shared/components'
import { ConsolePage } from './components'

export default {
  path: 'console',
  component: RoutingContainer,
  indexRoute: { component: ConsolePage }
}
