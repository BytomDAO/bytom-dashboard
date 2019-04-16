import React from 'react'
import {connect} from 'react-redux'
import {ErrorBanner, TextField, PasswordField} from 'features/shared/components'
import actions from 'actions'
import { Link } from 'react-router'
import styles from '../FormIndex.scss'
import {reduxForm} from 'redux-form'
import {withNamespaces} from 'react-i18next'

class Register extends React.Component {
  constructor(props) {
    super(props)
    this.submitWithValidations = this.submitWithValidations.bind(this)
  }

  submitWithValidations(data) {
    return new Promise((resolve, reject) => {
      this.props.registerKey(data)
        .catch((err) => reject({_error: err}))
    })
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
        <div>
          <h2 className={styles.title}>{t('init.title')}</h2>
          <div className={styles.formWarpper}>
            <form className={styles.form} onSubmit={handleSubmit(this.submitWithValidations)}>
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
              <Link
                className='btn btn-link'
                to='/initialization/'>
                {t('commonWords.cancel')}
              </Link>
            </form>
          </div>
        </div>
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
    registerKey: (token) => dispatch(actions.initialization.registerKey(token))
  })
)(reduxForm({
  form: 'initDefaultPassword',
  fields: ['keyAlias', 'password', 'repeatPassword', 'accountAlias'],
  validate
})(Register)))
