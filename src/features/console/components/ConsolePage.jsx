import React from 'react'
import componentClassNames from 'utility/componentClassNames'
import {PageContent, PageTitle, ConsoleSection} from 'features/shared/components'
import styles from './ConsolePage.scss'
import {connect} from 'react-redux'
import actions from 'actions'

class ConsolePage extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const lang = this.props.core.lang

    return (
      <div className={componentClassNames(this, 'flex-container', styles.mainContainer)}>
        <PageTitle title={'Console'}/>
        <PageContent>
          <ConsoleSection
            cmd={this.props.cmd}
          />
        </PageContent>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  core: state.core
})

const mapDispatchToProps = (dispatch) => ({
  cmd: (data) => dispatch(actions.console.request(data)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConsolePage)
