import React from 'react'
import { BaseNew, FormContainer, FormSection, TextField, CheckboxField } from 'features/shared/components'
import { policyOptions } from 'features/accessControl/constants'
import { reduxForm } from 'redux-form'
import actions from 'features/accessControl/actions'
import {withNamespaces} from 'react-i18next'

class NewToken extends React.Component {
  constructor(props) {
    super(props)
    this.submitWithValidations = this.submitWithValidations.bind(this)
  }

  submitWithValidations(data) {
    return new Promise((resolve, reject) => {
      this.props.submitForm(data)
        .catch((err) => reject(err))
    })
  }


  render() {
    const {
      fields: { guardData },
      error,
      handleSubmit,
      submitting
    } = this.props
    const t = this.props.t

    return(
      <FormContainer
        error={error}
        label={ t('token.newAccessToken') }
        onSubmit={handleSubmit(this.submitWithValidations)}
        submitting={submitting}
        >

        <FormSection title={ t('token.info') }>
          <TextField title={ t('token.name') } fieldProps={guardData.id} autoFocus={true} />
        </FormSection>
      </FormContainer>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  submitForm: (data) => dispatch(actions.submitTokenForm(data))
})

export default  withNamespaces('translations') (BaseNew.connect(
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
      const t = props.t

      if (!values.guardData.id) {
        errors.guardData = {id: t('errorMessage.tokenError')}
      }

      return errors
    }
  })(NewToken)
))
