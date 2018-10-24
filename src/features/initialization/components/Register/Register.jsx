import React from 'react'
import {connect} from 'react-redux'
import {ErrorBanner, TextField, PasswordField} from 'features/shared/components'
import actions from 'actions'
import styles from './Register.scss'
import {reduxForm} from 'redux-form'
import {chainClient} from 'utility/environment'
import {withNamespaces} from 'react-i18next'

class Register extends React.Component {
  constructor(props) {
    super(props)
    this.connection = chainClient().connection

    this.submitWithErrors = this.submitWithErrors.bind(this)
  }

  componentDidMount() {
    this.setState({
      init: true
    })
  }

  submitWithErrors(data) {
    return new Promise((resolve, reject) => {
      this.props.registerKey(data)
        .catch((err) => reject({_error: err.message}))
    })
  }

  setMode(isInit) {
    this.setState({
      init: isInit
    })
  }

  restore() {
    const element = document.getElementById('bytom-restore-file-upload-init')
    element.click()
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
      this.connection.request('/restore-wallet', backupData).then(resp => {
        if (resp.status === 'fail') {
          this.props.showError(new Error(resp.msg))
          return
        }
        this.props.success()
      })
    }
    fileReader.readAsText(files[0], 'UTF-8')

    const fileElement = document.getElementById('bytom-restore-file-upload-init')
    fileElement.value = ''
  }

  render() {
    const t = this.props.t

    const {
      fields: {keyAlias, password, repeatPassword, accountAlias},
      error,
      handleSubmit,
      submitting
    } = this.props

    return (
      <div className={styles.main}>
        {
          this.state && this.state.init &&
          <div>
            <h2 className={styles.title}>{t('init.title')}</h2>
            <div className={styles.formWarpper}>
              <form className={styles.form} onSubmit={handleSubmit(this.submitWithErrors)}>
                <TextField
                  title={t('form.accountAlias')}
                  placeholder={t('init.accountPlaceholder')}
                  fieldProps={accountAlias} />
                <TextField
                  title={t('form.keyAlias')}
                  placeholder={t('init.keyPlaceholder')}
                  fieldProps={keyAlias}/>
                <PasswordField
                  title={t('init.keyPassword')}
                  placeholder={t('init.passwordPlaceholder')}
                  fieldProps={password} />
                <PasswordField
                  title={t('init.repeatKeyPassword')}
                  placeholder={t('init.repeatPlaceHolder')}
                  fieldProps={repeatPassword} />

                {error &&
                <ErrorBanner
                  title={t('init.errorTitle')}
                  error={error}/>}

                <button type='submit' className='btn btn-primary' disabled={submitting}>
                  {t('init.register')}
                </button>
                <a className={`${styles.choice} ${(this.state && this.state.init) ? '' : styles.active}`}
                   href='javascript:;' onClick={this.setMode.bind(this, false)}>
                  {t('init.restoreWallet')}
                </a>
              </form>
            </div>
          </div>
        }
        {
          this.state && !this.state.init &&
          <div>
            <h2 className={styles.title}>{t('init.restoreWallet')}</h2>
            <div className={styles.formWarpper}>
              <form className={styles.form} onSubmit={handleSubmit(this.submitWithErrors)}>
                <button className='btn btn-primary' onClick={this.restore.bind(this)}>
                  {t('init.restore')}
                </button>
                <a className={`${styles.choice} ${(this.state && this.state.init) ? styles.active : ''}`}
                   href='javascript:;' onClick={this.setMode.bind(this, true)}>
                  {t('init.title')}
                </a>

                <p></p>
                <p>{t('init.restoreLabel')}</p>

                <input id='bytom-restore-file-upload-init' type='file' style={{'display': 'none'}}
                       onChange={this.handleFileChange.bind(this)}/>
              </form>
            </div>
          </div>
        }
      </div>
    )
  }
}

const validate = (values, props) => {
  const errors = {}
  const t = props.t

  if (!values.keyAlias) {
    errors.keyAlias = t('key.aliasRequired')
  }
  if (!values.password) {
    errors.password = t('key.passwordRequired')
  } else if (values.password.length < 5) {
    errors.password = ( t('key.reset.newPWarning') )
  }
  if (values.password !== values.repeatPassword) {
    errors.repeatPassword = ( t('key.reset.repeatPWarning') )
  }
  if (!values.accountAlias) {
    errors.accountAlias = ( t('account.new.aliasWarning') )
  }

  return errors
}

export default withNamespaces('translations')( connect(
  () => ({}),
  (dispatch) => ({
    registerKey: (token) => dispatch(actions.core.registerKey(token)),
    showError: (err) => dispatch({type: 'ERROR', payload: err}),
    success: () => dispatch({type: 'CREATE_REGISTER_ACCOUNT'})
  })
)(reduxForm({
  form: 'initDefaultPassword',
  fields: ['keyAlias', 'password', 'repeatPassword', 'accountAlias'],
  validate
})(Register)))
