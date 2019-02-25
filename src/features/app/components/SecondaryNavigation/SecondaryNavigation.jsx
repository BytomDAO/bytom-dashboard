import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import actions from 'actions'
import { navIcon } from '../../utils'
import styles from './SecondaryNavigation.scss'
import {withNamespaces} from 'react-i18next'

class SecondaryNavigation extends React.Component {
  constructor(props) {
    super(props)

    this.logOut = this.logOut.bind(this)
  }

  logOut(event) {
    event.preventDefault()
    this.props.logOut()
  }

  render() {
    const t = this.props.t
    return (
      <div className={styles.main}>
        <ul className={styles.navigation}>
          <li className={styles.navigationTitle}>{ t('crumbName.settings') }</li>

          <li>
            <Link to='/core' activeClassName={styles.active}>
              {navIcon('core', styles)}
              { t('crumbName.coreStatus') }
            </Link>
          </li>
          
          <li>
            <Link to='/backup' activeClassName={styles.active}>
              {navIcon('client', styles)}
              { t('crumbName.backupRestore') }
            </Link>
          </li>

          {
            this.props.canViewTokens &&
            <li>
              <Link to='/access-control' activeClassName={styles.active}>
                {navIcon('network', styles)}
                { t('crumbName.accessControl')}
              </Link>
            </li>
          }

          {this.props.canLogOut && <li className={styles.logOut}>
            <a href='#' onClick={this.logOut}>
              {navIcon('logout', styles)}
              { t('crumbName.logout') }
            </a>
          </li>}

        </ul>
      </div>
    )
  }
}

export default connect(
  (state) => ({
    canLogOut: !!state.core.clientToken,
    canViewTokens: !state.core.clientToken,
  }),
  (dispatch) => ({
    logOut: () => dispatch(actions.core.clearSession)
  })
)(  withNamespaces('translations') (SecondaryNavigation) )
