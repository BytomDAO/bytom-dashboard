import React from 'react'
import TutorialInfo from './TutorialInfo/TutorialInfo'
import TutorialForm from './TutorialForm/TutorialForm'
import TutorialModal from './TutorialModal/TutorialModal'

const components = {
  TutorialInfo,
  TutorialForm
  // TutorialModal
}

class Tutorial extends React.Component {
  render() {
    // const userInput = this.props.tutorial.userInputs
    //
    const tutorialOpen = !this.props.tutorial.location.isVisited
    //
    // const tutorialRoute = this.props.currentStep['route']
    const tutorialTypes = this.props.types
    const TutorialComponent = components[this.props.content['component']]
    // const TutorialComponent = components[0]


    return (
      <div>
            {/*{tutorialOpen && (tutorialTypes.includes(this.props.currentStep['component'])) &&*/}
            {/*tutorialOpen &&*/}
              {/*<TutorialComponent*/}
                {/*// userInput={userInput}*/}
                {/*// {...this.props.currentStep}*/}
                {/*// handleNext={() => this.props.showNextStep(tutorialRoute)}*/}
                {/*{...this.props.content}*/}
              {/*/>}*/}
        {tutorialOpen && (tutorialTypes.includes(this.props.content['component'])) &&
          <TutorialComponent
          // userInput={userInput}
          // {...this.props.currentStep}
          // handleNext={() => this.props.showNextStep(tutorialRoute)}
            {...this.props.content}
          />}
      </div>
    )
  }
}

import { actions } from 'features/tutorial'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  // currentStep: state.tutorial.currentStep,
  content: state.tutorial.content,
  tutorial: state.tutorial
})

const mapDispatchToProps = ( dispatch ) => ({
  showNextStep: (route) => dispatch(actions.tutorialNextStep(route))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tutorial)
