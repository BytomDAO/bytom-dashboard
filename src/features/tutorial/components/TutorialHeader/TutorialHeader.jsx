import React from 'react'
import { Link } from 'react-router'
import styles from './TutorialHeader.scss'

class TutorialHeader extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tutorialHeight: 0
    }
    this.handleTutorialHeight = this.handleTutorialHeight.bind(this)
  }

  componentDidUpdate() {
    this.handleTutorialHeight()
  }

  handleTutorialHeight() {
    if (this.state.tutorialHeight != this.tutorialContainer.clientHeight){
      this.setState({tutorialHeight: this.tutorialContainer.clientHeight})
    }
  }

  render() {
    if(!this.props.tutorial.isShowing || this.props.currentStep.component == 'TutorialModal'){
      return (
        <div>
          {this.props.children}
        </div>
      )
    } else {
      return (
        <div className={`${styles.main} ${this.props.showTutorial && styles.collapsed}`} ref={element => this.tutorialContainer = element}>
          <div className={styles.header}>
            {this.props.currentStep.title}
            <div className={styles.skip}>
              {!this.props.showTutorial && <Link to={this.props.tutorial.route}>
                Resume tutorial
              </Link>}
              {this.props.showTutorial &&
              <a onClick={this.props.dismissTutorial}>{this.props.currentStep.dismiss || 'End tutorial'}</a>}
            </div>
          </div>
          {this.props.showTutorial && this.props.children}
        </div>
      )
    }
  }
}

import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  tutorial: state.tutorial,
  currentStep: state.tutorial.currentStep,
  showTutorial: state.routing.locationBeforeTransitions.pathname.includes(state.tutorial.route)
})

const mapDispatchToProps = ( dispatch ) => ({
  dismissTutorial: () => dispatch({ type: 'DISMISS_TUTORIAL' })
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TutorialHeader)
