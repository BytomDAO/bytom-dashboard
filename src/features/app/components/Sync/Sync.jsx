import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { humanizeDuration } from 'utility/time'
import testnetUtils from 'features/testnet/utils'
import { navIcon } from '../../utils'
import navStyles from '../Navigation/Navigation.scss'
import styles from './Sync.scss'
import { chainClient } from 'utility/environment'

class Sync extends React.Component {
  constructor(props) {
    super(props)

    const fetchInfo = () => {
      chainClient().config.info().then(resp => {
        this.setState(resp.data)
      })
    }
    setInterval(fetchInfo.bind(this), 2 * 1000)
  }

  render() {
    const {
      onTestnet,
      replicationLag,
      snapshot,
      syncEstimates,
      testnetError,
      testnetNextReset
    } = this.props

    if (snapshot && snapshot.inProgress) { // Currently downloading the snapshot.
      const downloaded = (snapshot.downloaded / snapshot.size) * 100

      return <ul className={`${navStyles.navigation} ${styles.main}`}>
        {onTestnet &&
          <li className={navStyles.navigationTitle}>chain testnet snapshot</li>
        }
        {!onTestnet &&
          <li className={navStyles.navigationTitle}>snapshot sync</li>
        }

        <li>{snapshot.height} blocks</li>
        {!!downloaded && <li>{Math.round(downloaded)}% downloaded</li>}
        {!!syncEstimates.snapshot && <li>Time remaining: {humanizeDuration(syncEstimates.snapshot)}</li>}
      </ul>
    }

    const elems = []

    if (onTestnet) {
      elems.push(<li key='sync-title' className={navStyles.navigationTitle}>chain testnet sync</li>)
    } else {
      elems.push(<li key='sync-title' className={navStyles.navigationTitle}>generator sync</li>)
    }

    if (onTestnet && !testnetError && testnetNextReset) {
      const diff = testnetNextReset.diff(moment(), 'seconds')
      if (diff < 2 * 24 * 60 * 60) {
        elems.push(<li key='sync-reset-warning'><span className={styles.testnetReset}>Next reset: {humanizeDuration(diff)}</span></li>)
      }
    }

    if (onTestnet && testnetError) {
      elems.push(<li key='sync-error'>
        <Link to='/core'>
          {navIcon('error', navStyles)}
          <span className={styles.testnetError}>Chain Testnet error</span>
        </Link>
      </li>)
    } else {
      if (replicationLag === null || replicationLag >= 2) {
        elems.push(<li key='sync-lag'>Blocks behind: {replicationLag === null ? '-' : replicationLag}</li>)

        if (syncEstimates.replicationLag) {
          elems.push(<li key='sync-time'>Time remaining: {humanizeDuration(syncEstimates.replicationLag)}</li>)
        }
      } else {
        elems.push(<li key='sync-done'>Local core fully synced.</li>)
      }
    }

    const arr = Object.keys(this.state).map(key => {
      return <li key={key}>{key + ': ' + String(this.state[key])}</li>
    })
    arr.unshift(<li key='sync-title' className={navStyles.navigationTitle}>Network status</li>)

    return <ul className={`${navStyles.navigation} ${styles.main}`}>{arr}</ul>
  }
}

export default connect(
  (state) => ({
    onTestnet: state.core.onTestnet,
    routing: state.routing, // required for <Link>s to update active state on navigation
    replicationLag: state.core.replicationLag,
    snapshot: state.core.snapshot,
    syncEstimates: state.core.syncEstimates,
    testnetError: testnetUtils.isBlockchainMismatch(state) || testnetUtils.isCrosscoreRpcMismatch(state),
    testnetNextReset: state.testnet.nextReset,
  })
)(Sync)
