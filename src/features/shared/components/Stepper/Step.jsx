import React from 'react'
import styles from './stepper.scss'
import {withNamespaces} from 'react-i18next'

class Step extends React.Component {

  render() {
    const {
      isActive,
      displayPrevious,
      displayNext,
      component,
      children,
      t,
      nextL,
      prevL
    } = this.props

    if(isActive === false) return null

    return (
      <div>
          {component ? React.createElement(component) : children}
          <Next
            label={nextL || t('commonWords.continue')}
            isActive={displayNext}
            goToNextStep={() => this.props.goToNextStep()}
          />
          <Previous
            label={prevL || t('commonWords.cancel')}
            isActive={displayPrevious}
            goToPreviousStep={() => this.props.goToPreviousStep()}
          />
      </div>
    )
  }
}

class Next extends React.Component {

  render() {
    const { isActive, label } = this.props
    if (isActive === false) return null

    return (
      <button
        className={`btn btn-primary ${styles.floatLeft}`}
        onClick={() => this.props.goToNextStep()}>
        {label}
      </button>
    )
  }
}

class Previous extends React.Component {

  render() {
    const { isActive, label } = this.props
    if (isActive === false) return null

    return (
      <a
        className={`btn btn-link ${styles.marginLeft}`}
        onClick={() => this.props.goToPreviousStep()}>
        {label}
      </a>
    )
  }
}

export default withNamespaces('translations') (Step)