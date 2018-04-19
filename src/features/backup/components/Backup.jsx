import React from 'react'
import componentClassNames from 'utility/componentClassNames'
import {PageContent, PageTitle} from 'features/shared/components'
import styles from './Backup.scss'
import {connect} from 'react-redux'
import {chainClient} from 'utility/environment'

class Backup extends React.Component {
  constructor(props) {
    super(props)
    this.connection = chainClient().connection
  }

  backup() {
    this.connection.request('/backup-wallet').then(resp => {
      const date = new Date()
      const dateStr = date.toLocaleDateString().split(' ')[0]
      const fileName = 'bytom-wallet-backup-' + dateStr

      var element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(resp.data)))
      element.setAttribute('download', fileName)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()

      document.body.removeChild(element)
    })
  }

  handleFileChange(event) {
    const files = event.target.files
    if (files.length <= 0) {
      this.setState({key: null})
      return
    }

    const fileReader = new FileReader()
    fileReader.onload = fileLoadedEvent => {
      const backupData = JSON.parse(fileLoadedEvent.target.result)
      window.console.log(backupData)
    }
    fileReader.readAsText(files[0], 'UTF-8')
  }

  restore() {
    const element = document.getElementById('bytom-restore-file-upload')
    element.click()
  }

  render() {
    const lang = this.props.core.lang
    const newButton = <button className='btn btn-primary' onClick={this.backup.bind(this)}>
      {lang === 'zh' ? '备份' : 'Backup'}
    </button>
    const restoreButton = <button className='btn btn-primary' onClick={this.restore.bind(this)}>
      {lang === 'zh' ? '恢复' : 'Restore'}
    </button>

    return (
      <div className={componentClassNames(this, 'flex-container', styles.mainContainer)}>
        <PageTitle title={lang === 'zh' ? '备份与恢复' : 'Backup and restore'}/>
        <PageContent>
          {newButton}
          <hr/>
          {restoreButton}
          <input id='bytom-restore-file-upload' type='file' style={{'display': 'flex', 'alignItems': 'center', 'fontSize': '12px'}}
                 onChange={this.handleFileChange.bind(this)}/>
        </PageContent>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  core: state.core,
  navAdvancedState: state.app.navAdvancedState,
})

export default connect(
  mapStateToProps
)(Backup)
