import React from 'react'
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
    return (
      !this.props.isVisited && <div className={`${styles.main} ${!this.props.isVisited && styles.collapsed}`} ref={element => this.tutorialContainer = element}>
        <div className={styles.header}>
          {this.props.content && this.props.content.title }
          <div className={styles.skip}>
            {!this.props.isVisited &&
            <a onClick={this.props.dismissTutorial}>close</a>}
          </div>
        </div>
        {!this.props.isVisited && this.props.children}
      </div>
    )
  }
}

import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  visitedLocation: state.tutorial.location.visited,
  isVisited: state.tutorial.location.isVisited,
  content: state.tutorial.content,
  tutorial: state.tutorial,
})

const mapDispatchToProps = ( dispatch ) => ({
  dismissTutorial: () => dispatch({ type: 'DISMISS_TUTORIAL' })
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TutorialHeader)
