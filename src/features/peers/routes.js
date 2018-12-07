// import { RoutingContainer } from 'features/shared/components'
// import { PeerIndex } from './components'
// import { List } from './components'
//
//
// export default {
//   path: 'peers',
//   component: RoutingContainer,
//   indexRoute: { component: List }
// }
//

import { List } from './components'
import { makeRoutes } from 'features/shared'

export default (store) => makeRoutes(store, 'peer', List)
