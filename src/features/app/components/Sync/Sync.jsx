import React from 'react'
import { connect } from 'react-redux'
import navStyles from '../Navigation/Navigation.scss'
import styles from './Sync.scss'

class Sync extends React.Component {
  render() {
    const coreData = this.props.coreData
    if (!coreData) {
      return <ul></ul>
    }

    const arr = Object.keys(coreData).map(key => {
      return <li key={key}>{key + ': ' + String(coreData[key])}</li>
    })
    arr.unshift(<li key='sync-title' className={navStyles.navigationTitle}>Network status</li>)

    return <ul className={`${navStyles.navigation} ${styles.main}`}>{arr}</ul>
  }
}

export default connect(
  (state) => ({
    coreData: state.core.coreData,
  })
)(Sync)
