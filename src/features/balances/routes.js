import { List , VoteDetails } from './components'
import { makeRoutes } from 'features/shared'

export default (store) => makeRoutes(store, 'balance', List, null, null,  {
  childRoutes: [
    {
      path: 'vote/:id',
      component: VoteDetails,
    },
  ]
})
