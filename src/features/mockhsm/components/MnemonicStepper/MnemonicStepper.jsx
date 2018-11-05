import React from 'react'
import {connect} from 'react-redux'
import actions from 'actions'
import { NotFound, Step, StepList, ConfirmMnemonic, Mnemonic, PageContent, PageTitle } from 'features/shared/components'
import {Skip} from '../'
import styles from './MnemonicStepper.scss'

class MnemonicStepper extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    if (this.props.mnemonic.length === 0) {
      return <NotFound />
    }

    return (
      <div>
        <PageTitle title={'Mnemonic'} />

        <PageContent>
          <div className={styles.main}>
            <StepList>
              <Step>
                <Skip/>
                <button className={`btn btn-primary ${styles.marginRight}`}
                        onClick={() => this.props.succeeded()}
                >
                  skip
                </button>
              </Step>
              <Step>
                <Mnemonic
                  mnemonic={this.props.mnemonic}
                />
              </Step>

              <Step>
                <ConfirmMnemonic
                  mnemonic={this.props.mnemonic}
                  succeeded={this.props.succeeded}
                />

              </Step>
            </StepList>
          </div>
        </PageContent>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MnemonicStepper)
