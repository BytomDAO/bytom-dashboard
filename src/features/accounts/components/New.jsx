import React from 'react'
import { BaseNew, FormContainer, FormSection, JsonField, PasswordField, TextField } from 'features/shared/components'
import { reduxForm } from 'redux-form'
import {withNamespaces} from 'react-i18next'
import actions from 'actions'

class Form extends React.Component {
  constructor(props) {
    super(props)

    this.submitWithValidations = this.submitWithValidations.bind(this)
  }

  submitWithValidations(data) {
    return new Promise((resolve, reject) => {
      this.props.createAccount(data)
        .catch((err) => reject({_error: err}))
    })
  }

  render() {
    const {
      fields: { alias, password, repeatPassword },
      error,
      handleSubmit,
      submitting,
      t
    } = this.props

    return(
      <FormContainer
        error={error}
        label={ t('account.new.newAccount') }
        onSubmit={handleSubmit(this.submitWithValidations)}
        submitting={submitting}
      >

        <FormSection title={ t('account.new.information') }>
          <TextField title={ t('form.alias')} placeholder={  t('form.alias')} fieldProps={alias} autoFocus={true} />
          <PasswordField title={ t('key.password')}  placeholder={ t('key.passwordPlaceholder')} fieldProps={password} autoFocus={false} />
          <PasswordField title={ t('key.repeatPassword')} placeholder={ t('key.repeatPasswordPlaceholder')} fieldProps={repeatPassword} autoFocus={false} />
        </FormSection>
      </FormContainer>
    )
  }
}

const validate = ( values, props ) => {
  const errors = { xpubs:{} }
  const t = props.t

  if (!values.alias) { errors.alias = ( t('account.new.aliasWarning')) }


  return errors
}

const fields = [
  'alias',
  'password',
  'repeatPassword'
]

export default withNamespaces('translations')( BaseNew.connect(
  BaseNew.mapStateToProps('account'),
  (dispatch) => ({
    ...BaseNew.mapDispatchToProps('account')(dispatch),
    createAccount: (data) => dispatch(actions.account.createAccount(data))
  }),
  reduxForm({
    form: 'newAccountForm',
    fields,
    validate,
  })(Form)
))
