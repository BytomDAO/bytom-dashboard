import React from 'react'
import {connect} from 'react-redux'
import {ErrorBanner, PasswordField, TextField, TextareaField} from 'features/shared/components'
import actions from 'actions'
import {reduxForm} from 'redux-form'
import {withNamespaces} from 'react-i18next'
import { Link } from 'react-router'

class RestoreMnemonic extends React.Component {
  constructor(props) {
    super(props)
    this.submitWithErrors = this.submitWithErrors.bind(this)
  }

  submitWithErrors(data) {
    return new Promise((resolve, reject) => {
      this.props.restoreMnemonic(data, this.props.success)
        .catch((err) => reject({_error: err}))
    })
  }

  render() {
    const t = this.props.t

    const {
      fields: {mnemonic, keyAlias, password, confirmPassword},
      error,
      handleSubmit,
      submitting
    } = this.props


    return (
        <div>
          <h2 >{t('init.restoreWallet')}</h2>
          <div>
            <form onSubmit={handleSubmit(this.submitWithErrors)}>

              <TextareaField
                title={'mnemonic'}
                fieldProps={mnemonic}
              />
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
                fieldProps={confirmPassword} />

              {error &&
              <ErrorBanner
                title={t('init.errorTitle')}
                error={error}/>}

              <button type='submit' className='btn btn-primary' disabled={submitting}>
                {t('init.restore')}
              </button>

            </form>
          </div>
        </div>
    )
  }
}

const validate = (values, props) => {
  const errors = {}
  const t = props.t

  if (!values.mnemonic) {
    errors.mnemonic = 'random'
  }
  if (!values.keyAlias) {
    errors.keyAlias = t('key.aliasRequired')
  }
  if (!values.password) {
    errors.password = t('key.passwordRequired')
  } else if (values.password.length < 5) {
    errors.password = ( t('key.reset.newPWarning') )
  }
  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = ( t('key.reset.repeatPWarning') )
  }

  return errors
}


export default withNamespaces('translations')( connect(
  () => ({}),
  (dispatch) => ({
    restoreMnemonic: (token, success) => dispatch(actions.initialization.restoreMnemonic(token, success)),
  })
)(reduxForm({
  form: 'restoreMnemonic',
  fields: [
    'mnemonic',
    'keyAlias',
    'password',
    'confirmPassword',
  ],
  validate
})(RestoreMnemonic)))
