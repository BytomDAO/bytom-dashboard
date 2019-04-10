import React from 'react'
import { BaseNew, FormContainer, FormSection, JsonField, KeyConfiguration, TextField } from 'features/shared/components'
import { reduxForm } from 'redux-form'
import {withNamespaces} from 'react-i18next'

class Form extends React.Component {
  constructor(props) {
    super(props)

    this.submitWithValidations = this.submitWithValidations.bind(this)
  }

  submitWithValidations(data) {
    return new Promise((resolve, reject) => {
      this.props.submitForm(data)
        .catch((err) => reject({_error: err}))
    })
  }

  render() {
    const {
      fields: { alias, xpubs, quorum },
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
        </FormSection>

        <FormSection title={ t('form.keyAndSign')}>
          <KeyConfiguration
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

  values.xpubs.forEach((xpub, index) => {
    if (!values.xpubs[index].value) {
      errors.xpubs[index] = {...errors.xpubs[index], value: ( t('account.new.keyWarning'))}
    }
  })

  return errors
}

const fields = [
  'alias',
  'xpubs[].value',
  'xpubs[].type',
  'quorum'
]

export default withNamespaces('translations')( BaseNew.connect(
  BaseNew.mapStateToProps('account'),
  BaseNew.mapDispatchToProps('account'),
  reduxForm({
    form: 'newAccountForm',
    fields,
    validate,
    initialValues: {
      quorum: 1,
    }
  })(Form)
))
