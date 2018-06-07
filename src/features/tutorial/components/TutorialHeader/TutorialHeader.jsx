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
    const lang = this.props.lang
    if(this.props.isVisited){
      return(
        <div>
          {this.props.children}
        </div>
      )
    }else {
      return( <div className={`${styles.main} ${!this.props.isVisited && styles.collapsed}`} ref={element => this.tutorialContainer = element}>
        <div className={styles.header}>
          {this.props.content && (lang === 'zh'?this.props.content.title_zh:this.props.content.title) }
          <div className={styles.skip}>
            {!this.props.isVisited &&
            <a onClick={this.props.dismissTutorial}>{lang === 'zh'? '关闭' : 'close'}</a>}
          </div>
        </div>
        {!this.props.isVisited && this.props.children}
      </div>)
    }
  }
}

import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  visitedLocation: state.tutorial.location.visited,
  isVisited: state.tutorial.location.isVisited,
  content: state.tutorial.content,
  tutorial: state.tutorial,
  lang:state.core.lang
})

const mapDispatchToProps = ( dispatch ) => ({
  dismissTutorial: () => dispatch({ type: 'DISMISS_TUTORIAL' })
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TutorialHeader)
