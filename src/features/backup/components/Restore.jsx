import React from 'react'
import {chainClient} from 'utility/environment'
import {connect} from 'react-redux'

class Restore extends React.Component {
  constructor(props) {
    super(props)
    this.connection = chainClient().connection
    this.fileuploadId = `bytom-restore-file-upload-${this.props.index}`
  }

  handleFileChange(event) {
    const files = event.target.files
    if (files.length <= 0) {
      this.setState((pre) => {
        return Object.assign(pre, {key: null})
      })
      return
    }

    const fileReader = new FileReader()
    fileReader.onload = fileLoadedEvent => {
      const backupData = JSON.parse(fileLoadedEvent.target.result)
      this.connection.request('/restore-wallet', backupData).then(resp => {
        if (resp.status === 'fail') {
          this.props.showError(new Error(resp.msg))
          return
        }
        this.props.showSuccess()
      })
    }
    fileReader.readAsText(files[0], 'UTF-8')

    const fileElement = document.getElementById(this.fileuploadId)
    fileElement.value = ''
  }

  restore() {
    const element = document.getElementById(this.fileuploadId)
    element.click()
  }

  render() {
    const lang = this.props.core.lang

    return (
      <span class='restore'>
        <button className='btn btn-primary' onClick={this.restore.bind(this)}>
          {lang === 'zh' ? '恢复' : 'Restore'}
        </button>
        <input id={this.fileuploadId} type='file'
               style={{'display': 'none', 'alignItems': 'center', 'fontSize': '12px'}}
               onChange={this.handleFileChange.bind(this)}/>
      </span>
    )
  }
}

const mapStateToProps = (state) => ({
  core: state.core
})

const mapDispatchToProps = (dispatch) => ({
  showError: (err) => {
    dispatch({type: 'ERROR', payload: err})
  },
  showSuccess: () => dispatch({type: 'RESTORE_SUCCESS'})
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Restore)
