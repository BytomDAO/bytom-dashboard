import React from 'react'
import { connect } from 'react-redux'
import navStyles from '../Navigation/Navigation.scss'
import styles from './Sync.scss'

class Sync extends React.Component {
  render() {
    const coreData = this.props.coreData
    if(!coreData){
      return <ul></ul>
    }
    const syncing = coreData.syncing
    // const syncing = true
    const peerCount = coreData.peerCount
    const currentBlock = coreData.currentBlock
    // const currentBlock = 1
    const highestBlock = coreData.highestBlock
    // const highestBlock = currentBlock
    const lang = this.props.lang

    if (syncing) {
      return <ul className={`${navStyles.navigation} ${styles.main}`}>
        <li key='sync-title' className={navStyles.navigationTitle}>{ lang === 'zh' ? '网络同步状态' : 'Network Sync Status'}</li>
        <li key='sync-status'>{lang === 'zh' ? '同步中: ' : 'Synchronizing: '}  {currentBlock}/{highestBlock}</li>
        <li key='sync-peer-count'>{lang === 'zh' ? '节点数' : 'Peer Count'}: {peerCount}</li>
      </ul>
    }

    const elems = []

    elems.push(<li key='sync-title' className={navStyles.navigationTitle}>{ lang === 'zh' ? '网络同步状态' : 'Network Sync Status' }</li>)

    if(!syncing && currentBlock == highestBlock){
      elems.push(<li key='sync-done'>{lang === 'zh' ? '同步完成: ' : 'Fully synced: ' } <span className={styles.testnetReset}>{currentBlock}/{highestBlock}</span></li>)
    }

    if(!syncing && currentBlock < highestBlock){
      elems.push(<li key='sync-disconnect'>{lang === 'zh' ? '同步中断' : 'Disconnect'}</li>)
    }

    elems.push(<li key='sync-peer-count'>{lang === 'zh' ? '节点数' : 'Peer Count'}: {peerCount}</li>)

    return <ul className={`${navStyles.navigation} ${styles.main}`}>{elems}</ul>
  }
}

export default connect(
  (state) => ({
    coreData:state.core.coreData
  })
)(Sync)
