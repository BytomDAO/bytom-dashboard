import React from 'react'
import styles from './TutorialHeader.scss'
import { capitalize } from 'utility/string'

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
    const t = this.props.t
    if(this.props.isVisited){
      return(
        <div>
          {this.props.children}
        </div>
      )
    }else {
      return( <div className={`${styles.main} ${!this.props.isVisited && styles.collapsed}`} ref={element => this.tutorialContainer = element}>
        <div className={styles.header}>
          {this.props.content && capitalize(t(`crumbName.${this.props.content.title}`)) }
          <div className={styles.skip}>
            {!this.props.isVisited &&
            <a onClick={this.props.dismissTutorial}>{ t('commonWords.close')}</a>}
          </div>
        </div>
        {!this.props.isVisited && this.props.children}
      </div>)
    }
  }
}

import { connect } from 'react-redux'
import {withNamespaces} from 'react-i18next'

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
)( withNamespaces('translations') (TutorialHeader) )
