import React from 'react'
import { connect } from 'react-redux'
import { RestoreKeystore, RestoreMnemonic, PageContent, PageTitle, ErrorBanner} from 'features/shared/components'
import styles from './Backup.scss'
import actions from 'actions'
import {withNamespaces} from 'react-i18next'

class Backup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: null,
      error: null
    }

    this.mnemonicPopup = this.mnemonicPopup.bind(this)
    this.keystorePopup = this.keystorePopup.bind(this)
    this.submitWithValidation = this.submitWithValidation.bind(this)
  }

  setValue(event) {
    this.setState({
      value:event.target.value
    })
  }

  mnemonicPopup(e) {
    e.preventDefault()
    this.props.showModal(
      <RestoreMnemonic success={this.props.success}/>
    )
  }

  keystorePopup(e){
    e.preventDefault()
    this.props.showModal(
      <RestoreKeystore success={this.props.success}/>
    )
  }

  submitWithValidation() {
    this.props.backup()
      .then(()=>{
        this.setState({
          error: null
        })
      })
      .catch((err) => {
        this.setState({
          error: err
        })
      })
  }

  render() {
    const {t} = this.props

    const {error} = this.state

    const newButton = <button className={`btn btn-primary btn-lg ${styles.submit}`} onClick={() => this.submitWithValidation()}>
      {t('backup.download')}
    </button>
    const restoreKeystoreButton = <button className={`btn btn-primary btn-lg ${styles.submit}`} onClick={this.keystorePopup}>
      {t('backup.selectFile')}
    </button>

    const restoreMnemonicButton = <button className={`btn btn-primary btn-lg ${styles.submit}`} onClick={this.mnemonicPopup}>
      {t('backup.restore')}
    </button>

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
                         value='restoreKeystore' />
                  <div className={`${styles.choice} ${styles.restoreKeystore}`}>
                    <span className={styles.choice_title}>{t('backup.restoreKeystore')}</span>
                    <p>
                      {t('backup.restoreKeystoreDescription')}
                    </p>
                  </div>
                </label>
              </div>

              <div className={styles.choice_wrapper}>
                <label>
                  <input className={styles.choice_radio_button}
                         type='radio'
                         name='type'
                         value='restoreMnemonic' />
                  <div className={`${styles.choice} ${styles.restoreMnemonic}`}>
                    <span className={styles.choice_title}>{t('backup.restoreMnemonic')}</span>
                    <p>
                      {t('backup.restoreMnemonicDescription')}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className={styles.choices}>
              <div>
                {
                  this.state.value === 'backup'
                  &&[<div className={styles.submitWrapper}>{error && <ErrorBanner error={error} />}</div>,
                    <span className={styles.submitWrapper}>{newButton}</span>]
                }
              </div>

              <div>
                {
                  this.state.value === 'restoreKeystore'
                  &&
                    <span className={styles.submitWrapper}>{restoreKeystoreButton}</span>
                }
              </div>

              <div>
                {
                  this.state.value === 'restoreMnemonic'
                  &&  <span className={styles.submitWrapper}>{restoreMnemonicButton}</span>
                }
              </div>
            </div>

          </div>

        </PageContent>
      </div>
    )
  }
}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch) => ({
  backup: () => dispatch(actions.backUp.backup()),
  success: () => dispatch(actions.backUp.success()),
  showModal: (body) => dispatch(actions.app.showModal(
    body,
    actions.app.hideModal,
    null,
    {
      noCloseBtn: true
    }
  ))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces('translations') (Backup))
