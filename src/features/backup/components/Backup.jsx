import React from 'react'
import componentClassNames from 'utility/componentClassNames'
import {PageContent, PageTitle} from 'features/shared/components'
import styles from './Backup.scss'
import {connect} from 'react-redux'
import {chainClient} from 'utility/environment'
import Restore from './Restore'

class Backup extends React.Component {
  constructor(props) {
    super(props)
    this.connection = chainClient().connection
  }

  backup() {
    this.connection.request('/backup-wallet').then(resp => {
      if (resp.status === 'fail') {
        this.props.showError(new Error(resp.msg))
        return
      }

      const date = new Date()
      const dateStr = date.toLocaleDateString().split(' ')[0]
      const timestamp = date.getTime()
      const fileName = ['bytom-wallet-backup-', dateStr, timestamp].join('-')

      var element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(resp.data)))
      element.setAttribute('download', fileName)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()

      document.body.removeChild(element)
    })
  }

  render() {
    const lang = this.props.core.lang
    const newButton = <button className='btn btn-primary' onClick={this.backup.bind(this)}>
      {lang === 'zh' ? '备份' : 'Backup'}
    </button>

    return (
      <div className={componentClassNames(this, 'flex-container', styles.mainContainer)}>
        <PageTitle title={lang === 'zh' ? '备份与恢复' : 'Backup and restore'}/>
        <PageContent>
          {newButton}
          <hr/>
          <Restore index='0'></Restore>
        </PageContent>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  core: state.core,
})

const mapDispatchToProps = (dispatch) => ({
  showError: (err) => {
    dispatch({type: 'ERROR', payload: err})
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Backup)
