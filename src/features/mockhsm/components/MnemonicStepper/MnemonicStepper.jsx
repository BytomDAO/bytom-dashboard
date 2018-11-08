import React from 'react'
import {connect} from 'react-redux'
import actions from 'actions'
import { NotFound, Step, StepList, ConfirmMnemonic, Mnemonic, PageContent, PageTitle } from 'features/shared/components'
import componentClassNames from 'utility/componentClassNames'
import styles from './MnemonicStepper.scss'
import {withNamespaces} from 'react-i18next'

class MnemonicStepper extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    if (this.props.mnemonic.length === 0) {
      return <NotFound />
    }
    const t = this.props.t

    return (
      <div className={componentClassNames(this, 'flex-container')}>
        <PageTitle title={t('mnemonic.backup')} />

          <div className={`${styles.main} flex-container`}>
            <div className={styles.content}>
              <StepList>
                <Step
                nextL={t('mnemonic.continue')}
                >
                  <Mnemonic
                    mnemonic={this.props.mnemonic}
                  />
                  <button className={`btn btn-default ${styles.marginLeft}`}
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
    )
  }
}

const mapStateToProps = (state) => {
  const mnemonic = (state.key || {}).mnemonic || []
  if (mnemonic) return {mnemonic}
  return {}
}

const mapDispatchToProps = ( dispatch ) => ({
  succeeded: () => dispatch(actions.key.createSuccess()),
})

export default withNamespaces('translations') (connect(
  mapStateToProps,
  mapDispatchToProps
)(MnemonicStepper))
