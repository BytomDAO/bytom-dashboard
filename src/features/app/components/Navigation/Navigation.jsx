import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import styles from './Navigation.scss'
import {navIcon} from '../../utils'
import Sync from '../Sync/Sync'
import {docsRoot, releaseUrl} from '../../../../utility/environment'
import { capitalize } from 'utility/string'
import {withNamespaces} from 'react-i18next'
import actions from 'actions'

class Navigation extends React.Component {
  constructor(props) {
    super(props)
    this.openTutorial = this.openTutorial.bind(this)
    this.state={
      transaction:0
    }
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
          <li >
            <Link to='/transactions'
              onClick={() =>{this.setState({transaction:0})}}
              activeClassName={this.state.transaction ==0 && styles.active}>
              {navIcon('transaction', styles)}
              {capitalize(t('crumbName.transaction'))}
            </Link>
          </li>
          <li>
            <Link to={{
              pathname: '/transactions',
              state: { title: '"营业执照" 存证'}
            }}
            onClick={() =>{this.setState({transaction:1})}}
            activeClassName={this.state.transaction ==1 && styles.active}
            >
              {navIcon('transaction', styles)}
              {'"营业执照" 存证'}
            </Link>
          </li>
          <li>
            <Link activeClassName={this.state.transaction ==2 && styles.active} to={{
              pathname: '/transactions',
              state: { title: '"不动产证明" 存证' }
            }}
            onClick={() =>{this.setState({transaction:2})}}
            >
              {navIcon('transaction', styles)}
              {'"不动产证明" 存证'}
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
          <li className={styles.navigationTitle}>{t('crumbName.account')}( {this.props.currentAccount} )</li>
          <li>
            <Link to='/accounts' activeClassName={styles.active}>
              {navIcon('account', styles)}
              {capitalize(t('crumbName.accountManagement'))}
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
      showNavAdvance: state.app.navAdvancedState === 'advance',
      currentAccount: state.account.currentAccount
    }
  },
  (dispatch) => ({
    fetchFederationItem: () => dispatch(actions.federation.fetchItems()),
  })
)( withNamespaces('translations')(Navigation))
