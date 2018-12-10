import { Container } from 'features/app/components'
import { NotFound } from 'features/shared/components'
import accessControl from 'features/accessControl/routes'
import { routes as accounts } from 'features/accounts'
import { routes as assets } from 'features/assets'
import { routes as balances } from 'features/balances'
import { routes as configuration } from 'features/configuration'
import { routes as core } from 'features/core'
import { routes as initialization } from 'features/initialization'
import { routes as transactions } from 'features/transactions'
import { routes as transactionFeeds } from 'features/transactionFeeds'
import { routes as unspents } from 'features/unspents'
import { routes as mockhsm } from 'features/mockhsm'
import { routes as backup } from 'features/backup'
import { routes as peers } from 'features/peers'

const makeRoutes = (store) => ({
  path: '/',
  component: Container,
  childRoutes: [
    accessControl(store),
    accounts(store),
    assets(store),
    balances(store),
    configuration,
    core,
    peers(store),
    initialization,
    transactions(store),
    transactionFeeds(store),
    unspents(store),
    mockhsm(store),
    backup,
    {
      path: '*',
      component: NotFound
    }
  ]
})

export default makeRoutes
