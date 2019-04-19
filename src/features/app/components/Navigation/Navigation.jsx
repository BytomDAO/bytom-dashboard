import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import styles from './Navigation.scss'
import {navIcon} from '../../utils'
import Sync from '../Sync/Sync'
import {docsRoot, releaseUrl} from '../../../../utility/environment'
import { capitalize } from 'utility/string'
import {withNamespaces} from 'react-i18next'

class Navigation extends React.Component {
  constructor(props) {
    super(props)

    this.openTutorial = this.openTutorial.bind(this)
  }

  openTutorial(event) {
    event.preventDefault()
    this.props.openTutorial()
  }

  render() {
    const t = this.props.t
    return (
      <div className={styles.main}>
        {this.props.update && <div className={`${styles.updateWarning} ${styles.smallFont}`}>
          <a href={releaseUrl} target='_blank'>
            <img src={require('images/warning.svg')} className={styles.warningIcon} />
            {this.props.newVersionCode}{t('crumbName.update')}
          </a>
        </div>}
        <ul className={styles.navigation}>
          <li className={styles.navigationTitle}>{t('crumbName.coreData')}</li>
          <li>
            <Link to='/transactions' activeClassName={styles.active}>
              {navIcon('transaction', styles)}
              {capitalize(t('crumbName.transaction'))}
            </Link>
          </li>
          <li>
            <Link to='/assets' activeClassName={styles.active}>
              {navIcon('asset', styles)}
              {capitalize(t('crumbName.asset'))}
            </Link>
          </li>
        </ul>

        <ul className={styles.navigation}>
          <li className={styles.navigationTitle}>{ t('crumbName.services') }</li>
          <li>
            <Link to='/keys' activeClassName={styles.active}>
              {navIcon('mockhsm', styles)}
              {capitalize((t('crumbName.key')))}
            </Link>
          </li>
        </ul>
        <ul className={styles.navigation}>
          <li className={styles.navigationTitle}>区块链政务</li>
          <li>
            <a href='/equity' target='_blank'>
              {navIcon('transaction', styles)}
              政务智能合约
            </a>
          </li>
        </ul>


        <Sync/>

      </div>
    )
  }
}

export default connect(
  state => {
    return {
      newVersionCode: state.core.newVersionCode,
      update: state.core.update,
      coreData: state.core.coreData,
      routing: state.routing, // required for <Link>s to update active state on navigation
      showNavAdvance: state.app.navAdvancedState === 'advance'
    }
  }
)( withNamespaces('translations')(Navigation))
