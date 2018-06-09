import React from 'react'
import { connect } from 'react-redux'
import { ProgressBar, OverlayTrigger, Tooltip } from 'react-bootstrap'
import navStyles from '../Navigation/Navigation.scss'
import styles from './Sync.scss'

class Sync extends React.Component {
  render() {
    const coreData = this.props.coreData
    if(!coreData){
      return <ul></ul>
    }
    const networkID = coreData.networkId
    const syncing = coreData.syncing
    const peerCount = coreData.peerCount
    const currentBlock = coreData.currentBlock
    const highestBlock = coreData.highestBlock
    const lang = this.props.lang

    const now = ( (highestBlock === 0) ? 0 : (currentBlock * 100/highestBlock))
    const tooltip = (
      <Tooltip id='tooltip'>
        {currentBlock}/{highestBlock} <strong>({now.toFixed(1)}%)</strong>
      </Tooltip>
    )
    const progressInstance = (<ProgressBar className={styles.progressBar} now={now} />)

    if (syncing) {
      return <ul className={`${navStyles.navigation} ${styles.main}`}>
        <li key='sync-title' className={navStyles.navigationTitle}>{ networkID } { lang === 'zh' ? '同步状态' : 'Sync Status'}</li>
        <li key='sync-peer-count' className={(peerCount>0)?styles.blockHightlight: null}>{lang === 'zh' ? '连接数' : 'Peer Count'}: {peerCount}</li>
        <li key='sync-status'> <OverlayTrigger placement='top' overlay={tooltip}>
          <div> {lang === 'zh' ? '区块同步中...' : 'Synchronizing...'} {progressInstance} </div>
        </OverlayTrigger></li>
      </ul>
    }

    const elems = []

    elems.push(<li key='sync-title' className={navStyles.navigationTitle}>{ networkID } { lang === 'zh' ? '同步状态' : 'Sync Status' }</li>)
    elems.push(<li key='sync-peer-count' className={(peerCount>0)?styles.blockHightlight: null}>{lang === 'zh' ? '连接数' : 'Peer Count'}: {peerCount}</li>)

    if(!syncing && currentBlock == highestBlock){
      elems.push(<li className={styles.blockHightlight} key='sync-done'>
        <OverlayTrigger placement='top' overlay={tooltip}>
          <div>
            {lang === 'zh' ? '同步完成 ' : 'Fully synced ' }{progressInstance}
          </div>
        </OverlayTrigger>
      </li>)
    }

    if(!syncing && currentBlock < highestBlock){
      elems.push(<li key='sync-disconnect'>{lang === 'zh' ? '同步中断' : 'Disconnect'}</li>)
    }

    return <ul className={`${navStyles.navigation} ${styles.main}`}>{elems}</ul>
  }
}

export default connect(
  (state) => ({
    coreData:state.core.coreData
  })
)(Sync)
