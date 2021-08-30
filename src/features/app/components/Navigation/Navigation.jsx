import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import styles from './Navigation.scss'
import { navIcon } from '../../utils'
import Sync from '../Sync/Sync'
import { docsRoot, docsRootZH, equityRoot, releaseUrl } from '../../../../utility/environment'
import { capitalize } from 'utility/string'
import { withNamespaces } from 'react-i18next'
import actions from 'actions'

class Navigation extends React.Component {
  constructor(props) {
    super(props)
    this.openTutorial = this.openTutorial.bind(this)
    this.state = {
      showFed: false,
    }
  }

  openTutorial(event) {
    event.preventDefault()
    this.props.openTutorial()
  }
  componentDidMount() {
    this.props
      .fetchFederationItem()
      .then((resp) => {
        this.setState({ showFed: true })
      })
      .catch((e) => {
        this.setState({ showFed: false })
      })
  }

  render() {
    const t = this.props.t
    return (
      <div className={styles.main}>
        {this.props.update && (
          <div className={`${styles.updateWarning} ${styles.smallFont}`}>
            <a href={releaseUrl} target="_blank">
              <img src={require('images/warning.svg')} className={styles.warningIcon} />
              {this.props.newVersionCode}
              {t('crumbName.update')}
            </a>
          </div>
        )}
        <ul className={styles.navigation}>
          <li>
            <Link to="/transactions" activeClassName={styles.active}>
              {/* {navIcon('transaction', styles)} */}
              <img src={require('images/navigation/transaction.svg')}/>
              {capitalize(t('crumbName.transaction'))}
            </Link>
          </li>
          <li>
            <Link to="/assets" activeClassName={styles.active}>
              {/* {navIcon('asset', styles)} */}
              <img src={require('images/navigation/asset.svg')}/>
              {capitalize(t('crumbName.asset'))}
            </Link>
          </li>
          <li>
            <Link to="/balances" activeClassName={styles.active}>
              {/* {navIcon('balance', styles)} */}
              <img src={require('images/navigation/balance.svg')}/>
              {capitalize(t('crumbName.balance'))}
            </Link>
          </li>
          <li>
            <Link to="/accounts" activeClassName={styles.active}>
              {/* {navIcon('account', styles)} */}
              <img src={require('images/navigation/account.svg')}/>
              {capitalize(t('crumbName.accountManagement'))}
            </Link>
          </li>
          {this.props.showNavAdvance && (
            <div>
              <li>
                <Link to="/unspents" activeClassName={styles.active}>
                  {/* {navIcon('unspent', styles)} */}
                  <img src={require('images/navigation/unspent.svg')}/>
                  {capitalize(t('crumbName.unspent'))}
                </Link>
              </li>
              <li>
                <Link to="/keys" activeClassName={styles.active}>
                  {/* {navIcon('mockhsm', styles)} */}
                  <img src={require('images/navigation/mockhsm.svg')}/>
                  {capitalize(t('crumbName.key'))}
                </Link>
              </li>
              <li>
                <a href={equityRoot} target="_blank">
                  {/* {navIcon('docs', styles)} */}
                  <img src={require('images/navigation/equity.svg')}/>
                  {capitalize(t('crumbName.equity'))}
                </a>
              </li>
            </div>
          )}
          <li>
            <a href={this.props.lng === 'zh' ? docsRootZH : docsRoot} target="_blank">
              {/* {navIcon('docs', styles)} */}
              <img src={require('images/navigation/docs.svg')}/>
              {capitalize(t('crumbName.doc'))}
            </a>
          </li>
        </ul>
      </div>
    )
    // return (
    //   <div className={styles.main}>
    //     {this.props.update && (
    //       <div className={`${styles.updateWarning} ${styles.smallFont}`}>
    //         <a href={releaseUrl} target="_blank">
    //           <img src={require('images/warning.svg')} className={styles.warningIcon} />
    //           {this.props.newVersionCode}
    //           {t('crumbName.update')}
    //         </a>
    //       </div>
    //     )}
    //     <ul className={styles.navigation}>
    //       <li className={styles.navigationTitle}>{t('crumbName.coreData')}</li>
    //       <li>
    //         <Link to="/transactions" activeClassName={styles.active}>
    //           {navIcon('transaction', styles)}
    //           {capitalize(t('crumbName.transaction'))}
    //         </Link>
    //       </li>

    //       <li>
    //         <Link to="/assets" activeClassName={styles.active}>
    //           {navIcon('asset', styles)}
    //           {capitalize(t('crumbName.asset'))}
    //         </Link>
    //       </li>
    //       <li>
    //         <Link to="/balances" activeClassName={styles.active}>
    //           {navIcon('balance', styles)}
    //           {capitalize(t('crumbName.balance'))}
    //         </Link>
    //       </li>
    //       {this.state.showFed && (
    //         <li>
    //           <Link to="/federations" activeClassName={styles.active}>
    //             {navIcon('federation', styles)}
    //             {capitalize(t('crumbName.federation'))}
    //           </Link>
    //         </li>
    //       )}
    //     </ul>

    //     {/* <ul className={styles.navigation}>
    //       <li className={styles.navigationTitle}>{ t('crumbName.services') }</li>
    //       <li>
    //         <Link to='/keys' activeClassName={styles.active}>
    //           {navIcon('mockhsm', styles)}
    //           {capitalize((t('crumbName.key')))}
    //         </Link>
    //       </li>
    //     </ul> */}
    //     <ul className={styles.navigation}>
    //       <li className={styles.navigationTitle}>
    //         {t('crumbName.account')}( {this.props.currentAccount} )
    //       </li>
    //       <li>
    //         <Link to="/accounts" activeClassName={styles.active}>
    //           {navIcon('account', styles)}
    //           {capitalize(t('crumbName.accountManagement'))}
    //         </Link>
    //       </li>
    //     </ul>

    //     {this.props.showNavAdvance && (
    //       <ul className={styles.navigation}>
    //         <li className={styles.navigationTitle}>{t('crumbName.advanced')}</li>
    //         <li>
    //           <Link to="/unspents" activeClassName={styles.active}>
    //             {navIcon('unspent', styles)}
    //             {capitalize(t('crumbName.unspent'))}
    //           </Link>
    //         </li>
    //         <li>
    //           <Link to="/keys" activeClassName={styles.active}>
    //             {navIcon('mockhsm', styles)}
    //             {capitalize(t('crumbName.key'))}
    //           </Link>
    //         </li>
    //       </ul>
    //     )}

    //     <ul className={styles.navigation}>
    //       <li className={styles.navigationTitle}>{t('crumbName.help')}</li>
    //       <li>
    //         <a href={docsRoot} target="_blank">
    //           {navIcon('docs', styles)}
    //           {t('crumbName.doc')}
    //         </a>
    //       </li>
    //     </ul>

    //     {/*<ul className={styles.navigation}>*/}
    //     {/*<li className={styles.navigationTitle}>{ t('crumbName.developer') }</li>*/}
    //     {/*<li>*/}
    //     {/*<a href='/equity' target='_blank'>*/}
    //     {/*{navIcon('transaction', styles)}*/}
    //     {/*{ t('crumbName.equity')}*/}
    //     {/*</a>*/}
    //     {/*</li>*/}
    //     {/*</ul>*/}

    //     <Sync />
    //   </div>
    // )
  }
}

export default connect(
  (state) => {
    return {
      newVersionCode: state.core.newVersionCode,
      update: state.core.update,
      coreData: state.core.coreData,
      routing: state.routing, // required for <Link>s to update active state on navigation
      showNavAdvance: state.app.navAdvancedState === 'advance',
      currentAccount: state.account.currentAccount,
    }
  },
  (dispatch) => ({
    fetchFederationItem: () => dispatch(actions.federation.fetchItems()),
  }),
)(withNamespaces('translations')(Navigation))
