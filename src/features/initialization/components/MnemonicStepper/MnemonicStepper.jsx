import React from 'react'
import {connect} from 'react-redux'
import actions from 'actions'
import { Step, StepList, ConfirmMnemonic, Mnemonic } from 'features/shared/components'
import {Skip} from '../'

class MnemonicStepper extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <StepList>
        <Step>
          <Skip/>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MnemonicStepper)
