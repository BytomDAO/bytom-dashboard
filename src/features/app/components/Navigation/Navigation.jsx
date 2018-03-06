import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import styles from './Navigation.scss'
import {navIcon} from '../../utils'
import Sync from '../Sync/Sync'

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
    const lang = this.props.lang
    return (
      <div className={styles.main}>
        <ul className={styles.navigation}>
          <li className={styles.navigationTitle}>core data</li>
          <li>
            <Link to='/transactions' activeClassName={styles.active}>
              {navIcon('transaction', styles)}
              {lang === 'zh' ? '交易' : 'Transactions'}
            </Link>
          </li>
          <li>
            <Link to='/accounts' activeClassName={styles.active}>
              {navIcon('account', styles)}
              {lang === 'zh' ? '账户' : 'Accounts'}
            </Link>
          </li>
          <li>
            <Link to='/assets' activeClassName={styles.active}>
              {navIcon('asset', styles)}
              {lang === 'zh' ? '资产' : 'Assets'}
            </Link>
          </li>
          <li>
            <Link to='/balances' activeClassName={styles.active}>
              {navIcon('balance', styles)}
              {lang === 'zh' ? '余额' : 'Balances'}
            </Link>
          </li>
        </ul>

        <ul className={styles.navigation}>
          <li className={styles.navigationTitle}>services</li>
          {this.props.mockhsm &&
          <li>
            <Link to='/keys' activeClassName={styles.active}>
              {navIcon('mockhsm', styles)}
              {lang === 'zh' ? '密钥' : 'Keys'}
            </Link>
          </li>
          }
        </ul>

        <ul className={styles.navigation}>
          <li className={styles.navigationTitle}>advanced</li>
          <li>
            <Link to='/unspents' activeClassName={styles.active}>
              {navIcon('unspent', styles)}
              Unspent outputs
            </Link>
          </li>
        </ul>

        {/*<ul className={`${styles.navigation} ${styles.border}`}>*/}
          {/*<li className={styles.navigationTitle}>language</li>*/}
          {/*<li>*/}
            {/*<DropdownButton*/}
              {/*className={`btn btn-default ${styles.addAction} ${styles.smallFont} ${styles.langBtn}`}*/}
              {/*id='input-dropdown-addon'*/}
              {/*title={this.props.lang === 'zh' ? '中文' : 'English'}*/}
              {/*onSelect={this.props.setLang}*/}
            {/*>*/}
              {/*<MenuItem className={`${styles.smallFont}`} eventKey='zh'>中文</MenuItem>*/}
              {/*<MenuItem className={`${styles.smallFont}`} eventKey='en'>English</MenuItem>*/}
            {/*</DropdownButton>*/}
          {/*</li>*/}
        {/*</ul>*/}

        <Sync/>
      </div>
    )
  }
}

export default connect(
  state => {
    let docVersion = ''

    const versionComponents = state.core.version.match('^([0-9]\\.[0-9])\\.')
    if (versionComponents != null) {
      docVersion = versionComponents[1]
    }

    return {
      routing: state.routing, // required for <Link>s to update active state on navigation
      showSync: state.core.configured && !state.core.generator,
      lang: state.core.lang,
      mockhsm: true,
      docVersion
    }
  },
  (dispatch) => ({
    openTutorial: () => dispatch({type: 'OPEN_TUTORIAL'}),
    setLang: (event) => {
      dispatch({
        type: 'UPDATE_CORE_LANGUAGE',
        lang: event
      })
    }
  })
)(Navigation)
