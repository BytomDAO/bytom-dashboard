import React from 'react'
import { BaseNew, FormContainer, FormSection, JsonField, KeyConfiguration, TextField } from 'features/shared/components'
import { reduxForm } from 'redux-form'

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
      fields: { alias, tags, definition, xpubs, quorum },
      error,
      handleSubmit,
      submitting
    } = this.props
    const lang = this.props.lang

    return(
      <FormContainer
        error={error}
        label= { lang === 'zh' ? '新建资产' : 'New asset' }
        onSubmit={handleSubmit(this.submitWithErrors)}
        submitting={submitting}
        lang={lang}>

        <FormSection title={ lang === 'zh' ? '资产信息' : 'Asset Information'}>
          <TextField title={ lang === 'zh' ? '别名' : 'Alias'} placeholder={ lang === 'zh' ? '别名' : 'Alias'} fieldProps={alias} autoFocus={true} />
          <JsonField title={ lang === 'zh' ? '定义' : 'Definition' } fieldProps={definition} lang={lang}/>
        </FormSection>

        <FormSection title={ lang === 'zh' ? '密钥和签名' :'Keys and Signing' }>
          <KeyConfiguration
            lang={lang}
            xpubs={xpubs}
            quorum={quorum}
            quorumHint={ lang === 'zh' ? '所需的签名数' : 'Number of signatures required to issue' } />
        </FormSection>

      </FormContainer>
    )
  }
}

const validate = (values,props) => {
  const errors = {}
  const lang = props.lang

  const jsonFields = ['definition']
  jsonFields.forEach(key => {
    const fieldError = JsonField.validator(values[key])
    if (fieldError) { errors[key] = fieldError }
  })

  if (!values.alias) { errors.alias = ( lang === 'zh' ? '资产别名是必须项' :'Asset alias is required' ) }

  return errors
}

const fields = [
  'alias',
  'definition',
  'xpubs[].value',
  'xpubs[].type',
  'quorum'
]
export default BaseNew.connect(
  BaseNew.mapStateToProps('asset'),
  BaseNew.mapDispatchToProps('asset'),
  reduxForm({
    form: 'newAssetForm',
    fields,
    validate,
    initialValues: {
      definition: '{\n  "name": "", \n  "symobol": "",\n  "decimals": 8,\n  "description": {}\n}',
      quorum: 1,
    }
  })(Form)
)
