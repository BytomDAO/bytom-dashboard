import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import actions from 'actions'
import { navIcon } from '../../utils'
import styles from './SecondaryNavigation.scss'

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
    const lang = this.props.lang
    return (
      <div className={styles.main}>
        <ul className={styles.navigation}>
          <li className={styles.navigationTitle}>{ lang === 'zh' ?  '设置' : 'settings'}</li>

          <li>
            <Link to='/core' activeClassName={styles.active}>
              {navIcon('core', styles)}
              { lang === 'zh' ?  '核心状态' : 'Core status' }
            </Link>
          </li>

          {
            this.props.canViewTokens &&
            <li>
              <Link to='/access-control' activeClassName={styles.active}>
                {navIcon('network', styles)}
                { lang === 'zh' ?  '访问控制' : 'Access Control'}
              </Link>
            </li>
          }

          {this.props.canLogOut && <li className={styles.logOut}>
            <a href='#' onClick={this.logOut}>
              {navIcon('logout', styles)}
              { lang === 'zh' ?  '退出' : 'Log Out' }
            </a>
          </li>}

          <li>
            <Link to='/backup' activeClassName={styles.active}>
              {navIcon('client', styles)}
              { lang === 'zh' ?  '备份与恢复' : 'Backup and Restore'}
            </Link>
          </li>
        </ul>
      </div>
    )
  }
}

export default connect(
  (state) => ({
    canLogOut: !!state.core.clientToken,
    canViewTokens: !state.core.clientToken,
    lang: state.core.lang
  }),
  (dispatch) => ({
    logOut: () => dispatch(actions.core.clearSession)
  })
)(SecondaryNavigation)
