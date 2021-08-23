import React from 'react'
import styles from './Main.scss'
import { MenuItem, Dropdown, DropdownButton } from 'react-bootstrap'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import actions from 'actions'
import Tutorial from 'features/tutorial/components/Tutorial'
import TutorialHeader from 'features/tutorial/components/TutorialHeader/TutorialHeader'
import { Navigation, SecondaryNavigation } from '../'
import { withNamespaces } from 'react-i18next'
import Sync from '../Sync/Sync'
import { navIcon } from '../../utils'

class Main extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      tutorialHeight: 0,
    }
    this.toggleDropdown = this.toggleDropdown.bind(this)
    this.setTutorialHeight = this.setTutorialHeight.bind(this)
  }

  setTutorialHeight(height) {
    this.setState({ tutorialHeight: height })
  }

  toggleDropdown(event) {
    event.stopPropagation()
    this.props.toggleDropdown()
  }

  render() {
    let logo = require('images/Logo-Bytom.png')

    const { t, i18n, version } = this.props

    const changeLanguage = (lng) => {
      i18n.changeLanguage(lng)
    }

    return (
      <div className={styles.main} onClick={this.props.closeDropdown}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarContent}>
            <div className={styles.header} style={{ marginTop: process.env.TARGET === 'electron' ? '40px' : '30px' }}>
              <Link to={'/'}>
                <img src={logo} className={styles.brand_image} />
              </Link>
              <div className={styles.headerInfo}>
                <div>Welcome Back,</div>
                <div>Dashboard</div>
              </div>
            </div>

            <Navigation />

            <div className={`${styles.footer} ${!this.props.showNavAdvance ? styles.bottom : ''}`}>
              <Sync />
              <div className={styles.version}>
                <span>
                  {t('commonWords.version')}: {version}
                </span>
              </div>
              <div className={styles.action}>
                <Dropdown id="dropdown-custom-1" bsSize="xsmall" onSelect={changeLanguage} dropup>
                  <Dropdown.Toggle noCaret className={styles.actionButton}>
                    <div>
                      <img src={require(`images/navigation/language.png`)} />
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className={styles.actionMenu}>
                    <MenuItem eventKey="zh">中文</MenuItem>
                    <MenuItem eventKey="en">ENGLISH</MenuItem>
                  </Dropdown.Menu>
                </Dropdown>

                <Dropdown id="dropdown-custom-1" bsSize="xsmall" dropup>
                  <Dropdown.Toggle noCaret className={styles.actionButton}>
                    <div>
                      <img src={require(`images/navigation/settings.png`)} />
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className={styles.actionMenu}>
                    <MenuItem eventKey="coreStatus">
                      <Link to="/core">{t('crumbName.coreStatus')}</Link>
                    </MenuItem>
                    <MenuItem eventKey="backupRestore">
                      <Link to="/backup">{t('crumbName.backupRestore')}</Link>
                    </MenuItem>
                    {this.props.canViewTokens && (
                      <MenuItem eventKey="accessControl">
                        <Link to="/access-control">{t('crumbName.accessControl')}</Link>
                      </MenuItem>
                    )}
                    {this.props.canLogOut && (
                      <MenuItem eventKey="logout" onClick={this.props.logOut}>
                        {t('crumbName.logout')}
                      </MenuItem>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.content} flex-container`} style={{ marginTop: this.state.tutorialHeight }}>
          {!this.props.connected && (
            <div className={styles.connectionIssue}>
              There was an issue connecting to Chain Core. Please check your connection while dashboard attempts to
              reconnect.
            </div>
          )}
          <TutorialHeader handleTutorialHeight={this.setTutorialHeight}>
            <Tutorial types={['TutorialInfo']} />
          </TutorialHeader>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default withNamespaces('translations')(
  connect(
    (state) => ({
      canLogOut: state.core.requireClientToken,
      canViewTokens: !state.core.clientToken,
      version: state.core.version,
      connected: true,
      showDropwdown: state.app.dropdownState == 'open',
      showNavAdvance: state.app.navAdvancedState === 'advance',
    }),
    (dispatch) => ({
      toggleDropdown: () => dispatch(actions.app.toggleDropdown),
      closeDropdown: () => dispatch(actions.app.closeDropdown),
      logOut: () => dispatch(actions.core.clearSession),
    }),
  )(Main),
)
