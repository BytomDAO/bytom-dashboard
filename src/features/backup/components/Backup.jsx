import React from 'react'
import componentClassNames from 'utility/componentClassNames'
import {PageContent, PageTitle} from 'features/shared/components'
import styles from './Backup.scss'
import {connect} from 'react-redux'
import {chainClient} from 'utility/environment'
import actions from 'actions'
import {withNamespaces} from 'react-i18next'

class Backup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: null
    }
  }

  setValue(event) {
    this.setState({
      value:event.target.value
    })
  }

  backup() {
    chainClient().backUp.backup()
      .then(resp => {
        const date = new Date()
        const dateStr = date.toLocaleDateString().split(' ')[0]
        const timestamp = date.getTime()
        const fileName = ['bytom-wallet-backup-', dateStr, timestamp].join('-')

        let element = document.createElement('a')
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(resp.data)))
        element.setAttribute('download', fileName)
        element.style.display = 'none'
        document.body.appendChild(element)
        element.click()

        document.body.removeChild(element)
      })
      .catch(err => { throw {_error: err} })
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
      this.props.restoreFile(backupData)
    }
    fileReader.readAsText(files[0], 'UTF-8')

    const fileElement = document.getElementById('bytom-restore-file-upload')
    fileElement.value = ''
  }

  restore() {
    const element = document.getElementById('bytom-restore-file-upload')
    element.click()
  }

  render() {
    const t = this.props.t

    const newButton = <button className={`btn btn-primary btn-lg ${styles.submit}`} onClick={this.backup.bind(this)}>
      {t('backup.download')}
    </button>
    const restoreButton = <button className={`btn btn-primary btn-lg ${styles.submit}`} onClick={this.restore.bind(this)}>
      {t('backup.selectFile')}
    </button>
    // const rescanButton = <button className={`btn btn-primary btn-lg ${styles.submit}`}  onClick={() => this.props.rescan()}>
    //   {lang === 'zh' ? '重新扫描' : 'Rescan'}
    // </button>

    return (
      <div className='flex-container'>
        <PageTitle title={t('backup.title')}/>
        <PageContent>

          <div onChange={e => this.setValue(e)}>
            <div className={styles.choices}>
              <div className={styles.choice_wrapper}>
                <label>
                  <input className={styles.choice_radio_button}
                         type='radio'
                         name='type'
                         value='backup'/>
                  <div className={`${styles.choice} ${styles.backup} `}>
                    <span className={styles.choice_title}>{t('backup.backup')}</span>
                    <p>
                      {t('backup.backupDescription')}
                    </p>
                  </div>
                </label>
              </div>

              <div className={styles.choice_wrapper}>
                <label>
                  <input className={styles.choice_radio_button}
                         type='radio'
                         name='type'
                         value='restore' />
                  <div className={`${styles.choice} ${styles.restore}`}>
                    <span className={styles.choice_title}>{t('backup.restore')}</span>
                    <p>
                      {t('backup.restoreDescription')}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className={styles.choices}>
              <div>
                {
                  this.state.value === 'backup'
                  &&<span className={styles.submitWrapper}>{newButton}</span>
                }
              </div>

              <div>
                {
                  this.state.value === 'restore'
                  &&
                    <span className={styles.submitWrapper}>{restoreButton}</span>
                }
                <input id='bytom-restore-file-upload' type='file'
                       style={{'display': 'none', 'alignItems': 'center', 'fontSize': '12px'}}
                       onChange={this.handleFileChange.bind(this)}/>
              </div>
            </div>
          </div>

        </PageContent>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  core: state.core,
  navAdvancedState: state.app.navAdvancedState,
})

const mapDispatchToProps = (dispatch) => ({
  backup: () => dispatch(actions.backUp.backup()),
  rescan: () => dispatch(actions.backUp.rescan()),
  restoreFile: (backUpFile) => dispatch(actions.backUp.restore(backUpFile)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( withNamespaces('translations') (Backup) )
