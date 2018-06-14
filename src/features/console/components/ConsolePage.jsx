import React from 'react'
import componentClassNames from 'utility/componentClassNames'
import {PageContent, PageTitle, ConsoleSection} from 'features/shared/components'
import styles from './ConsolePage.scss'
import {connect} from 'react-redux'
import {chainClient} from 'utility/environment'

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
          <ConsoleSection/>
        </PageContent>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  core: state.core
})

export default connect(
  mapStateToProps
)(ConsolePage)
