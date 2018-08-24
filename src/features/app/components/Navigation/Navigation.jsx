import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import styles from './Navigation.scss'
import {navIcon} from '../../utils'
import Sync from '../Sync/Sync'
import {docsRoot, releaseUrl} from '../../../../utility/environment'

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
        {this.props.update && <div className={`${styles.updateWarning} ${styles.smallFont}`}>
          <a href={releaseUrl} target='_blank'>
            <img src={require('images/warning.svg')} className={styles.warningIcon} />
            {this.props.newVersionCode}{lang === 'zh'? '版本更新': ' update available'}
          </a>
        </div>}
        <ul className={styles.navigation}>
          <li className={styles.navigationTitle}>{lang === 'zh' ? '核心数据' : 'core data'}</li>
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
          <li className={styles.navigationTitle}>{lang === 'zh' ? '服务' : 'services' }</li>
          <li>
            <Link to='/keys' activeClassName={styles.active}>
              {navIcon('mockhsm', styles)}
              {lang === 'zh' ? '密钥' : 'Keys'}
            </Link>
          </li>
        </ul>

        { this.props.showNavAdvance && <ul className={styles.navigation}>
          <li className={styles.navigationTitle}>{lang === 'zh' ? '高级' : 'advanced' }</li>
          <li>
            <Link to='/unspents' activeClassName={styles.active}>
              {navIcon('unspent', styles)}
              {lang === 'zh' ? '未花费输出' : 'Unspent outputs' }
            </Link>
          </li>
        </ul>}

        <ul className={styles.navigation}>
          <li className={styles.navigationTitle}>{lang === 'zh' ? '帮助' : 'help' }</li>
          <li>
            <a href={docsRoot} target='_blank'>
              {navIcon('docs', styles)}
              {lang === 'zh' ? '文档' : 'Documentation'}
            </a>
          </li>
        </ul>

        <ul className={styles.navigation}>
          <li className={styles.navigationTitle}>{lang === 'zh' ? '开发者' : 'Developer' }</li>
          <li>
            <a href='/equity' target='_blank'>
              {navIcon('transaction', styles)}
              {lang === 'zh' ? 'Equity 合约' : 'Equity Contract'}
            </a>
          </li>
        </ul>

        <Sync
          lang={lang}
        />

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
      lang: state.core.lang,
      showNavAdvance: state.app.navAdvancedState === 'advance'
    }
  },
  (dispatch) => ({
    setLang: (event) => {
      dispatch({
        type: 'UPDATE_CORE_LANGUAGE',
        lang: event
      })
    }
  })
)(Navigation)
