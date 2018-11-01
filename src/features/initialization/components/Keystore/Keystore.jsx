import React from 'react'
import {RestoreKeystore} from 'features/shared/components'
import {withNamespaces} from 'react-i18next'
import { Link } from 'react-router'
import {connect} from 'react-redux'
import actions from 'actions'

class Keystore extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const t = this.props.t

    return (
      <div >
        <RestoreKeystore success={this.props.success}/>
        <Link to='/initialization/restore'>
          cancel
        </Link>

      </div>
    )
  }
}


export default withNamespaces('translations') (connect(
  () => ({}),
  (dispatch) => ({
    success: () => dispatch(actions.initialization.initSucceeded()),
  })
)(Keystore))
