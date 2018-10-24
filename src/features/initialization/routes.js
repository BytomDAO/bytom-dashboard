import { RoutingContainer } from 'features/shared/components'
import { Index, Register } from './components'

export default {
  path: 'initialization',
  component: RoutingContainer,
  indexRoute: { component: Index },
  childRoutes: [
    {
      path: 'register',
      component: Register
    }
  ]
}
