import React from 'react'
import {connect} from 'react-redux'
import actions from 'actions'

class Skip extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <button
          onClick={() => this.props.succeeded()}
        >
          skip
        </button>
      </div>
    )
  }
}

const mapDispatchToProps = ( dispatch ) => ({
  succeeded: () => dispatch(actions.initialization.initSucceeded()),
})

export default connect(
  () => ({}),
  mapDispatchToProps
)(Skip)
