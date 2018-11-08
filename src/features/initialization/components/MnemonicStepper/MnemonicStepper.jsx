import React from 'react'
import {connect} from 'react-redux'
import actions from 'actions'
import { Step, StepList, ConfirmMnemonic, Mnemonic } from 'features/shared/components'
import styles from './MnemonicStepper.scss'
import {withNamespaces} from 'react-i18next'

class MnemonicStepper extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const t = this.props.t
    return (
      <div className={styles.main}>
        <div>
          <h2 className={styles.title}>{t('mnemonic.backup')}</h2>
          <div className={styles.formWarpper}>
            <div className={styles.form}>
              <StepList>
                <Step
                  nextL={t('mnemonic.continue')}
                >
                  <Mnemonic
                    mnemonic={this.props.mnemonic}
                  />
                  <button
                    className={'btn btn-link'}
                    onClick={() => this.props.succeeded()}
                  >
                    {t('mnemonic.skip')}
                  </button>
                </Step>
                <Step>
                  <ConfirmMnemonic
                    mnemonic={this.props.mnemonic}
                    succeeded={this.props.succeeded}
                  />
                </Step>
              </StepList>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const mnemonic = (state.initialization || {}).mnemonic || []
  if (mnemonic) return {mnemonic}
  return {}
}

const mapDispatchToProps = ( dispatch ) => ({
  succeeded: () => dispatch(actions.initialization.initSucceeded()),
})

export default withNamespaces('translations') (connect(
  mapStateToProps,
  mapDispatchToProps
)(MnemonicStepper))
