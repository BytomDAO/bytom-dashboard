import React from 'react'
import { BaseNew, FormContainer, FormSection, JsonField, KeyConfiguration, TextField, PasswordField } from 'features/shared/components'
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
      fields: { alias, xpubs, quorum, password, confirmPassword },
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
          <PasswordField title={ t('key.repeatPassword')} placeholder={ t('key.repeatPasswordPlaceholder')} fieldProps={confirmPassword} autoFocus={false} />
        </FormSection>

        <FormSection title={ t('form.keyAndSign')}>
          <KeyConfiguration
            autoGenerate
            xpubs={xpubs}
            quorum={quorum}
            quorumHint={t('account.new.quorumHint')}
          />
        </FormSection>
      </FormContainer>
    )
  }
}

const validate = ( values, props ) => {
  const errors = { xpubs:{} }
  const t = props.t

  const tagError = JsonField.validator(values.tags)
  if (tagError) { errors.tags = tagError }

  if (!values.alias) { errors.alias = ( t('account.new.aliasWarning')) }

  if (!values.password) {
    errors.password = ( t('key.passwordRequired') )
  }else if( values.password.length < 5 ) {
    errors.password = ( t('key.reset.newPWarning'))
  }
  if ( values.password !== values.confirmPassword ) {
    errors.confirmPassword = ( t('key.reset.repeatPWarning'))
  }

  values.xpubs.forEach((xpub, index) => {
    if (index>0 && !values.xpubs[index].value) {
      errors.xpubs[index] = {...errors.xpubs[index], value: ( t('account.new.keyWarning'))}
    }
  })

  return errors
}

const fields = [
  'alias',
  'xpubs[].value',
  'xpubs[].type',
  'quorum',
  'password',
  'confirmPassword'
]
const mapDispatchToProps = ( dispatch ) => ({
  createAccount: (data) => dispatch(actions.account.createAccount(data)),
  ...BaseNew.mapDispatchToProps('account')(dispatch)
})

export default withNamespaces('translations')( BaseNew.connect(
  BaseNew.mapStateToProps('account'),
  mapDispatchToProps,
  reduxForm({
    form: 'newAccountForm',
    fields,
    validate,
    initialValues: {
      quorum: 1,
    }
  })(Form)
))