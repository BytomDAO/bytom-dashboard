import React from 'react'
import { connect } from 'react-redux'
import { ProgressBar, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Link } from 'react-router'
import navStyles from '../Navigation/Navigation.scss'
import styles from './Sync.scss'
import {withNamespaces} from 'react-i18next'

class Sync extends React.Component {
  render() {
    const coreData = this.props.coreData
    const t = this.props.t
    if(!coreData){
      return <ul></ul>
    }
    const networkID = coreData.networkId
    const syncing = coreData.syncing
    const peerCount = coreData.peerCount
    const currentBlock = coreData.currentBlock
    const highestBlock = coreData.highestBlock

    const now = ( (highestBlock === 0) ? 0 : (currentBlock * 100/highestBlock))
    const tooltip = (
      <Tooltip id='tooltip'>
        {currentBlock}/{highestBlock} <strong>({now.toFixed(1)}%)</strong>
      </Tooltip>
    )
    const progressInstance = (<ProgressBar className={styles.progressBar} now={now} />)

    if (syncing) {
      return <ul className={`${navStyles.navigation} ${styles.main}`}>
        <li key='sync-title' className={navStyles.navigationTitle}>{ networkID } { t('sync.status')}</li>
        <li key='sync-peer-count' className={(peerCount>0)?styles.blockHightlight: null}>
          <Link to={'/peers'}>
            {t('sync.peer')}: {peerCount}
          </Link>
        </li>
        <li key='sync-status'> <OverlayTrigger placement='top' overlay={tooltip}>
          <div> {t('sync.synchronizing')} {progressInstance} </div>
        </OverlayTrigger></li>
      </ul>
    }

    const elems = []

    elems.push(<li key='sync-title' className={navStyles.navigationTitle}>{ networkID } {t('sync.status') }</li>)
    elems.push(<li key='sync-peer-count' className={(peerCount>0)?styles.blockHightlight: null}>
        <Link to={'/peers'}>
         {t('sync.peer')}: {peerCount}
        </Link>
      </li>)

    if(!syncing && currentBlock == highestBlock){
      elems.push(<li className={styles.blockHightlight} key='sync-done'>
        <OverlayTrigger placement='top' overlay={tooltip}>
          <div>
            {t('sync.synced') }{progressInstance}
          </div>
        </OverlayTrigger>
      </li>)
    }

    if(!syncing && currentBlock < highestBlock){
      elems.push(<li key='sync-disconnect'>{t('sync.disconnect')}</li>)
    }

    return <ul className={`${navStyles.navigation} ${styles.main}`}>{elems}</ul>
  }
}

export default connect(
  (state) => ({
    coreData:state.core.coreData
  })
)(withNamespaces('translations')(Sync))
