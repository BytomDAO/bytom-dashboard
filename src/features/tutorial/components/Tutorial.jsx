import React from 'react'
import TutorialInfo from './TutorialInfo/TutorialInfo'
import TutorialForm from './TutorialForm/TutorialForm'

const components = {
  TutorialInfo,
  TutorialForm
}

class Tutorial extends React.Component {
  render() {
    const tutorialOpen = !this.props.tutorial.location.isVisited
    const tutorialTypes = this.props.types
    const TutorialComponent = this.props.content ? components[this.props.content['component']]: components['TutorialInfo']

    return (
      <div>
        {this.props.content && tutorialOpen && (tutorialTypes.includes(this.props.content['component'])) &&
          <TutorialComponent
            advTx={this.props.advTx}
            {...this.props.content}
          />}
      </div>
    )
  }
}

import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  content: state.tutorial.content,
  tutorial: state.tutorial,
})

export default connect(
  mapStateToProps
)(Tutorial)
