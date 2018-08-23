import React from 'react'
import styles from './Main.scss'
import { MenuItem, Dropdown } from 'react-bootstrap'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import actions from 'actions'
import Tutorial from 'features/tutorial/components/Tutorial'
import TutorialHeader from 'features/tutorial/components/TutorialHeader/TutorialHeader'
import { Navigation, SecondaryNavigation } from '../'

class Main extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      tutorialHeight: 0
    }
    this.toggleDropdown = this.toggleDropdown.bind(this)
    this.setTutorialHeight = this.setTutorialHeight.bind(this)
  }

  setTutorialHeight(height) {
    this.setState({tutorialHeight: height })
  }

  toggleDropdown(event) {
    event.stopPropagation()
    this.props.toggleDropdown()
  }

  render() {
    let logo = require('images/logo-bytom-white.svg')

    const version = this.props.version
    const lang = this.props.lang

    return (
      <div className={styles.main}
           onClick={this.props.closeDropdown} >
        <div className={styles.sidebar}>
          <div className={styles.sidebarContent}>
            <div className={styles.logo}>
              <Link to={'/'}>
                <img src={logo} className={styles.brand_image} />
              </Link>

              <Dropdown
                id='dropdown-custom-1'
                bsSize='xsmall'
                className={styles.languagesContainer}
                pullRight
                onSelect={this.props.setLang}
              >
                <Dropdown.Toggle
                  className={styles.languages}
                  noCaret
                >
                  {lang === 'zh' ? '中' : 'EN'}
                </Dropdown.Toggle>
                <Dropdown.Menu
                  className={styles.languagesMenu}
                >
                  <MenuItem eventKey='zh'>中文</MenuItem>
                  <MenuItem eventKey='en'>ENGLISH</MenuItem>
                </Dropdown.Menu>
              </Dropdown>

              <span>
                <span className={styles.settings} onClick={this.toggleDropdown}>
                  <img src={require('images/navigation/settings.png')}/>
                </span>
                {this.props.showDropwdown && <SecondaryNavigation/>}
              </span>
            </div>

            <Navigation />

            <div className={styles.version}>
              <span>
                {lang==='zh'?'版本号':'Version'}: {version}
              </span>
            </div>

          </div>
        </div>

        <div className={`${styles.content} flex-container`} style={{marginTop: this.state.tutorialHeight}}>
          {!this.props.connected && <div className={styles.connectionIssue}>
            There was an issue connecting to Chain Core. Please check your connection while dashboard attempts to reconnect.
          </div>}
          <TutorialHeader handleTutorialHeight={this.setTutorialHeight}>
            <Tutorial types={['TutorialInfo']}/>
          </TutorialHeader>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default connect(
  (state) => ({
    canLogOut: state.core.requireClientToken,
    version:state.core.version,
    lang: state.core.lang,
    connected: true,
    showDropwdown: state.app.dropdownState == 'open',
  }),
  (dispatch) => ({
    toggleDropdown: () => dispatch(actions.app.toggleDropdown),
    closeDropdown: () => dispatch(actions.app.closeDropdown),
    setLang: (event) => {
      dispatch({
        type: 'UPDATE_CORE_LANGUAGE',
        lang: event
      })
    }
  })
)(Main)
