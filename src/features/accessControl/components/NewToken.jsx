import React from 'react'
import { BaseNew, FormContainer, FormSection, TextField, CheckboxField } from 'features/shared/components'
import { policyOptions } from 'features/accessControl/constants'
import { reduxForm } from 'redux-form'
import actions from 'features/accessControl/actions'

class NewToken extends React.Component {
  render() {
    const {
      fields: { guardData, policies },
      error,
      handleSubmit,
      submitting
    } = this.props
    const lang = this.props.lang

    return(
      <FormContainer
        error={error}
        label={ lang === 'zh' ? '新建访问令牌' : 'New access token' }
        onSubmit={handleSubmit(this.props.submitForm)}
        submitting={submitting}
        lang={lang}>

        <FormSection title={ lang === 'zh' ? '令牌信息' : 'Token information' }>
          <TextField title={ lang === 'zh' ? '令牌名称' : 'Token Name'} fieldProps={guardData.id} autoFocus={true} />
        </FormSection>
        {/*<FormSection title='Policy'>*/}
          {/*{policyOptions.map(option => {*/}
            {/*if (option.hidden) return*/}

            {/*return <CheckboxField key={option.label}*/}
              {/*title={option.label}*/}
              {/*hint={option.hint}*/}
              {/*fieldProps={policies[option.value]} />*/}
          {/*})}*/}
        {/*</FormSection>*/}

      </FormContainer>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  submitForm: (data) => dispatch(actions.submitTokenForm(data))
})

export default BaseNew.connect(
  BaseNew.mapStateToProps('accessControl'),
  mapDispatchToProps,
  reduxForm({
    form: 'newAccessGrantForm',
    fields: [
      'guardType',
      'guardData.id',
    ].concat(
      policyOptions.map(p => `policies.${p.value}`)
    ),
    validate: (values, props) => {
      const errors = {}
      const lang = props.lang

      if (!values.guardData.id) {
        errors.guardData = {id: ( lang === 'zh' ? '令牌名称是必须项' : 'Token name is required' )}
      }

      return errors
    }
  })(NewToken)
)
