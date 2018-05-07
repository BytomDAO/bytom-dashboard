import React from 'react'
import { Link } from 'react-router'
import styles from './TutorialHeader.scss'

class TutorialHeader extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidUpdate(prevProps) {
    if (this.tutorialContainer && this.props.tutorial != prevProps.tutorial){
      this.props.handleTutorialHeight(this.tutorialContainer.clientHeight)
    }else if(!this.tutorialContainer && this.props.tutorial != prevProps.tutorial){
      this.props.handleTutorialHeight(0)
    }
  }

  render() {
    // if(!this.props.tutorial.isShowing || this.props.currentStep.component == 'TutorialModal'){
    // if(!this.props.isVisited){
    //   return (
    //     <div>
    //       {this.props.children}
    //     </div>
    //   )
    // }
    // else {
      return (
        !this.props.isVisited && <div className={`${styles.main} ${!this.props.isVisited && styles.collapsed}`} ref={element => this.tutorialContainer = element}>
          <div className={styles.header}>
            {this.props.content && this.props.content.title }
            <div className={styles.skip}>
              {/*{!this.props.showTutorial && <Link to={this.props.tutorial.route}>*/}
                {/*Resume tutorial*/}
              {/*</Link>}*/}
              {!this.props.isVisited &&
              <a onClick={this.props.dismissTutorial}>close</a>}
              {/*<a onClick={this.props.dismissTutorial}>{this.props.currentStep.dismiss || 'End tutorial'}</a>*/}
            </div>
          </div>
          {!this.props.isVisited && this.props.children}
        </div>
      )
    // }
  }
}

import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  visitedLocation: state.tutorial.location.visited,
  isVisited: state.tutorial.location.isVisited,
  content: state.tutorial.content,

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
