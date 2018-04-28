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
      fields: { alias, xpubs, quorum },
      error,
      handleSubmit,
      submitting
    } = this.props
    const lang = this.props.lang

    return(
      <FormContainer
        error={error}
        label={ lang === 'zh' ? '新建账户' : 'New account' }
        onSubmit={handleSubmit(this.submitWithErrors)}
        submitting={submitting}
        lang={lang}
      >

        <FormSection title={ lang === 'zh' ? '账户信息' : 'Account Information' }>
          <TextField title={ lang === 'zh' ? '别名':'Alias'} placeholder={ lang === 'zh' ? '别名':'Alias'} fieldProps={alias} autoFocus={true} />
        </FormSection>

        <FormSection title={ lang === 'zh' ? '密钥和签名' : 'Keys and Signing' }>
          <KeyConfiguration
            xpubs={xpubs}
            quorum={quorum}
            quorumHint={ lang === 'zh' ? '传输所需的密钥数' : 'Number of keys required for transfer' }
            lang={lang}
          />
        </FormSection>
      </FormContainer>
    )
  }
}

const validate = ( values, props ) => {
  const errors = {}
  const lang = props.lang

  const tagError = JsonField.validator(values.tags)
  if (tagError) { errors.tags = tagError }

  if (!values.alias) { errors.alias = ( lang === 'zh' ? '账户别名是必须项' : 'Account alias is required' ) }

  return errors
}

const fields = [
  'alias',
  'xpubs[].value',
  'xpubs[].type',
  'quorum'
]

export default BaseNew.connect(
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
)
