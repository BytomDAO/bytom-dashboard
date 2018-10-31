import React from 'react'

class Step extends React.Component {

  render() {
    const {
      isActive,
      displayPrevious,
      displayNext,
      displaySubmit,
      component,
      children,
    } = this.props

    if(isActive === false) return null

    return (
      <div>
          {component ? React.createElement(component) : children}
          <Previous
            isActive={displayPrevious}
            goToPreviousStep={() => this.props.goToPreviousStep()}
          />
          <Next
            isActive={displayNext}
            goToNextStep={() => this.props.goToNextStep()}
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
      <button onClick={() => this.props.goToNextStep()}>
        Next
      </button>
    )
  }
}

class Previous extends React.Component {

  render() {
    const { isActive } = this.props
    if (isActive === false) return null

    return (
      <button onClick={() => this.props.goToPreviousStep()}>
        Previous
      </button>
    )
  }
}

class Submit extends React.Component {

  render() {
    const { isActive } = this.props
    if (isActive === false) return null

    return (
      <button
        type='submit'
        onClick={() => this.props.submit()}
      >
        { this.props.submitLabel || 'Submit' }
      </button>
    )

  }
}


export default Step