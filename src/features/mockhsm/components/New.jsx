import React from 'react'
import { BaseNew, FormContainer, FormSection, TextField, PasswordField } from 'features/shared/components'
import { reduxForm } from 'redux-form'
import {withNamespaces} from 'react-i18next'

class New extends React.Component {
  constructor(props) {
    super(props)

    this.submitWithValidations = this.submitWithValidations.bind(this)
    this.state = {
      checked: false,
      key: null
    }
  }

  submitWithValidations(data) {
    return new Promise((resolve, reject) => {
      this.props.submitForm(Object.assign({}, data, {
        xprv: this.state.key,
        index: 5000
      })).catch((err) => reject({_error: err}))
    })
  }

  render() {
    const {
      fields: { alias, password, confirmPassword, accountAlias },
      error,
      handleSubmit,
      submitting,
      t
    } = this.props

    return(
      <FormContainer
        error={error}
        label={ t('key.new')}
        onSubmit={handleSubmit(this.submitWithValidations)}
        submitting={submitting}
      >

        <FormSection title={ t('key.info') }>
          <TextField title={t('form.alias')} placeholder={ t('key.aliasPlaceHolder')} fieldProps={alias} autoFocus={true} />
          <PasswordField title={ t('key.password')}  placeholder={ t('key.passwordPlaceholder')} fieldProps={password} autoFocus={false} />
          <PasswordField title={ t('key.repeatPassword')} placeholder={ t('key.repeatPasswordPlaceholder')} fieldProps={confirmPassword} autoFocus={false} />
        </FormSection>
      </FormContainer>
    )
  }
}

const fields = [ 'alias', 'password', 'confirmPassword', 'accountAlias' ]
export default withNamespaces('translations') (BaseNew.connect(
  BaseNew.mapStateToProps('key'),
  BaseNew.mapDispatchToProps('key'),
  reduxForm({
    form: 'newMockHsmKey',
    fields,
    validate: (values, props) => {
      const errors = {}
      const t = props.t

      if (!values.alias) {
        errors.alias = ( t('key.aliasRequired') )
      }
      if (!values.password) {
        errors.password = ( t('key.passwordRequired') )
      }else if( values.password.length < 5 ) {
        errors.password = ( t('key.reset.newPWarning'))
      }
      if ( values.password !== values.confirmPassword ) {
        errors.confirmPassword = ( t('key.reset.repeatPWarning'))
      }

      return errors
    }
  })(New)
))
