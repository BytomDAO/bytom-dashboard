import React from 'react'
import {RestoreMnemonic} from 'features/shared/components'
import {withNamespaces} from 'react-i18next'
import { Link } from 'react-router'
import {connect} from 'react-redux'
import actions from 'actions'

class Mnemonic extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const t = this.props.t
    return (
      <div >
        <RestoreMnemonic success={this.props.success}/>
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
)(Mnemonic))
