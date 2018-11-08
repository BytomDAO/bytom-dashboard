import React from 'react'
import styles from './stepper.scss'

class Step extends React.Component {

  render() {
    const {
      isActive,
      displayPrevious,
      displayNext,
      component,
      children,
    } = this.props

    if(isActive === false) return null

    return (
      <div>
          {component ? React.createElement(component) : children}
          <Next
            isActive={displayNext}
            goToNextStep={() => this.props.goToNextStep()}
          />
          <Previous
            isActive={displayPrevious}
            goToPreviousStep={() => this.props.goToPreviousStep()}
          />
      </div>
    )
  }
}

class Next extends React.Component {

  render() {
    const { isActive } = this.props
    if (isActive === false) return null

    return (
      <button
        className={`btn btn-primary ${styles.floatLeft}`}
        onClick={() => this.props.goToNextStep()}>
        Continue
      </button>
    )
  }
}

class Previous extends React.Component {

  render() {
    const { isActive } = this.props
    if (isActive === false) return null

    return (
      <a
        className={`btn btn-link ${styles.marginLeft}`}
        onClick={() => this.props.goToPreviousStep()}>
        Cancel
      </a>
    )
  }
}

export default Step