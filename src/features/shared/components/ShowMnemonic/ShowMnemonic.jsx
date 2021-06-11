import React from 'react'
import { connect } from 'react-redux'
import { ErrorBanner, PasswordField, TextField, TextareaField, Mnemonic } from 'features/shared/components'
import actions from 'actions'
import { reduxForm } from 'redux-form'
import { withNamespaces } from 'react-i18next'
import { decryptMnemonic } from 'utility/bytom'
import { chainClient } from 'utility/environment'
import style from './ShowMnemonic.scss'

class RestoreMnemonic extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mnemonic: null,
    }
    this.submitWithValidations = this.submitWithValidations.bind(this)
  }

  submitWithValidations(data) {
    
    return chainClient()
      .backUp.backup()
      .then((res) => {
        if (res.status === 'fail') throw res
        
        const account = res.data.account_image.slices.find(item => item.account.alias === this.props.currentAccount)
        if (!account) throw { _error: 'Unknown error' }

        const keystore = res.data.key_images.xkeys.find((item) => item.xpub === account.account.xpubs[0])
        if (!keystore) throw { _error: 'Unknown error' }

        const cryptoMnemonic = localStorage.getItem(`mnemonic:${account.account.xpubs[0]}`)

        let mnemonic
        try {
          mnemonic = decryptMnemonic(cryptoMnemonic, data.password, keystore)
        } catch (e) {
          throw { _error: e }
        }
        this.props.showModal(<Mnemonic mnemonic={mnemonic} />)
      })
  }

  render() {
    const t = this.props.t

    const {
      fields: { password, confirmPassword },
      error,
      handleSubmit,
      submitting,
    } = this.props

    return (
      <div>
        <h4>{t('backup.showMnemonic')}</h4>
        <div>
          <form onSubmit={handleSubmit(this.submitWithValidations)}>
            <PasswordField
              title={t('init.keyPassword')}
              placeholder={t('init.passwordPlaceholder')}
              fieldProps={password}
            />
            <PasswordField
              title={t('init.repeatKeyPassword')}
              placeholder={t('init.repeatPlaceHolder')}
              fieldProps={confirmPassword}
            />

            {error && <ErrorBanner title={t('init.errorTitle')} error={error} />}

            <button type="submit" className={`btn btn-primary ${style.submitButton}`} disabled={submitting}>
              {t('form.ok')}
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

  if (!values.password) {
    errors.password = t('key.passwordRequired')
  } else if (values.password.length < 5) {
    errors.password = t('key.reset.newPWarning')
  }
  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = t('key.reset.repeatPWarning')
  }

  return errors
}

export default withNamespaces('translations')(
  connect(
    (state) => ({
      currentAccount: state.account.currentAccount,
    }),
    (dispatch) => ({
      restoreMnemonic: (token, success) => dispatch(actions.initialization.restoreMnemonic(token, success)),
      showModal: (body) => dispatch(actions.app.showModal(body, actions.app.hideModal, null, {})),
    }),
  )(
    reduxForm({
      form: 'showMnemonic',
      fields: ['password', 'confirmPassword'],
      validate,
    })(RestoreMnemonic),
  ),
)
