import React from 'react'
import { BaseNew, FormContainer, FormSection, TextField } from 'features/shared/components'
import { reduxForm } from 'redux-form'

class New extends React.Component {
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
      fields: { alias, password },
      error,
      handleSubmit,
      submitting
    } = this.props

    return(
      <FormContainer
        error={error}
        label='New key'
        onSubmit={handleSubmit(this.submitWithErrors)}
        submitting={submitting} >

        <FormSection title='Key Information'>
          <TextField title='Alias' placeholder='Alias' fieldProps={alias} autoFocus={true} />
          {/*<TextField title='Password' placeholder='Password' fieldProps={password} autoFocus={false} type={'password'} />*/}
        </FormSection>
      </FormContainer>
    )
  }
}

const fields = [ 'alias', 'password' ]
export default BaseNew.connect(
  BaseNew.mapStateToProps('key'),
  BaseNew.mapDispatchToProps('key'),
  reduxForm({
    form: 'newMockHsmKey',
    fields,
    validate: values => {
      const errors = {}

      if (!values.alias) {
        errors.alias = 'Key alias is required'
      }

      return errors
    }
  })(New)
)
