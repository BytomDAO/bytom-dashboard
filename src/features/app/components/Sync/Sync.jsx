import React from 'react'
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
    if (!this.state) {
      return <ul></ul>
    }

    const arr = Object.keys(this.state).map(key => {
      return <li key={key}>{key + ': ' + String(this.state[key])}</li>
    })
    arr.unshift(<li key='sync-title' className={navStyles.navigationTitle}>Network status</li>)

    return <ul className={`${navStyles.navigation} ${styles.main}`}>{arr}</ul>
  }
}

export default Sync
