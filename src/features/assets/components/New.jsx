import React from 'react'
import { BaseNew, FormContainer, FormSection, JsonField, KeyConfiguration, TextField } from 'features/shared/components'
import { reduxForm } from 'redux-form'
import {withNamespaces} from 'react-i18next'

class Form extends React.Component {
  constructor(props) {
    super(props)

    this.submitWithErrors = this.submitWithErrors.bind(this)
  }

  submitWithErrors(data) {
    return new Promise((resolve, reject) => {
      this.props.submitForm(data)
        .catch((err) => reject({_error: err}))
    })
  }

  render() {
    const {
      fields: { alias, definition, xpubs, quorum },
      error,
      handleSubmit,
      submitting,
      t
    } = this.props

    return(
      <FormContainer
        error={error}
        label= { t('asset.new') }
        onSubmit={handleSubmit(this.submitWithErrors)}
        submitting={submitting}
        >

        <FormSection title={t('asset.information')}>
          <TextField title={t('form.alias')} placeholder={t('form.alias')} fieldProps={alias} autoFocus={true} />
          <JsonField title={ t('form.definition') } fieldProps={definition}/>
        </FormSection>

        <FormSection title={t('asset.keyAndSign')}>
          <KeyConfiguration
            xpubs={xpubs}
            quorum={quorum}
            quorumHint={t('asset.quorumHint')} />
        </FormSection>

      </FormContainer>
    )
  }
}

const validate = (values, props) => {
  const errors = { xpubs:{} }
  const t = props.t

  const jsonFields = ['definition']
  jsonFields.forEach(key => {
    const fieldError = JsonField.validator(values[key])
    if (fieldError) { errors[key] = fieldError }
  })

  if (!values.alias) { errors.alias = t('asset.aliasError')  }

  values.xpubs.forEach((xpub, index) => {
    if (!values.xpubs[index].value) {
      errors.xpubs[index] = {...errors.xpubs[index], value: t('asset.keysError')}
    }
  })

  return errors
}

const fields = [
  'alias',
  'definition',
  'xpubs[].value',
  'xpubs[].type',
  'quorum'
]
export default withNamespaces('translations') ( BaseNew.connect(
  BaseNew.mapStateToProps('asset'),
  BaseNew.mapDispatchToProps('asset'),
  reduxForm({
    form: 'newAssetForm',
    fields,
    validate,
    initialValues: {
      definition: '{\n  "name": "", \n  "symbol": "",\n  "decimals": 8,\n  "description": {}\n}',
      quorum: 1,
    }
  })(Form)
))
