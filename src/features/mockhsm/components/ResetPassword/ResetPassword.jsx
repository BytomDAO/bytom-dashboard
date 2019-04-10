import React, {Component} from 'react'
import { reduxForm } from 'redux-form'

import { TextField, FormContainer, FormSection, PasswordField} from 'features/shared/components'

class ResetPassword extends Component {
  constructor(props) {
    super(props)
    this.submitWithValidations = this.submitWithValidations.bind(this)
    this.state = {}
  }

  submitWithValidations(data, xpub) {
    return new Promise((resolve, reject) => {
      const arg = {
        'xpub': xpub,
        'old_password': data.oldPassword,
        'new_password': data.newPassword
      }
      this.props.submitReset(arg)
        .catch((err) => reject({_error: err.message}))
    })
  }

  componentDidMount() {
    this.props.fetchItem().then(resp => {
      if (resp.data.length == 0) {
        this.setState({notFound: true})
      }
    })
  }

  render() {
    if (this.state.notFound) {
      return <NotFound />
    }
    const { item, t } = this.props

    if (!item) {
      return <div>Loading...</div>
    }

    const {
      fields: { oldPassword, newPassword, repeatPassword },
      error,
      handleSubmit,
      submitting
    } = this.props

    const title = <span>
      {t('key.reset.title')}
      <code>{item.alias}</code>
    </span>

    return (
      <FormContainer
        error={error}
        label={title}
        onSubmit={handleSubmit(value => this.submitWithValidations(value, item.xpub))}
        submitting={submitting}
        submitLabel= { t('key.reset.label')}
        >

        <FormSection title= { t('key.reset.label')}>
          <PasswordField
            title = {t('key.reset.oldPassword')}
            placeholder={t('key.reset.oldPPlaceholder')}
            fieldProps={oldPassword}
            />
          <PasswordField
            title = { t('key.reset.newPassword') }
            placeholder={ t('key.reset.newPasswordPlaceholder') }
            fieldProps={newPassword}
            />
          <PasswordField
            title = { t('key.reset.repeatPassword') }
            placeholder={ t('key.reset.repeatPasswordPlaceholder') }
            fieldProps={repeatPassword}
            />
        </FormSection>
      </FormContainer>
    )
  }
}

const validate = (values, props) => {
  const errors = {}
  const t = props.t

  if (!values.oldPassword) {
    errors.oldPassword = ( t('form.required'))
  }

  if (!values.newPassword) {
    errors.newPassword = (  t('form.required'))
  }else if(values.newPassword.length < 5){
    errors.newPassword = ( t('key.reset.newPWarning'))
  }

  if ( values.newPassword !== values.repeatPassword ) {
    errors.repeatPassword = ( t('key.reset.repeatPWarning') )
  }
  return errors
}

import {connect} from 'react-redux'
import actions from 'actions'
import {withNamespaces} from 'react-i18next'

const mapStateToProps = (state, ownProps) => ({
  item: state.key.items[ownProps.params.id],
})

const mapDispatchToProps = ( dispatch ) => ({
  fetchItem: () => dispatch(actions.key.fetchItems()),
  submitReset: (params) => dispatch(actions.key.submitResetForm(params))
})

export default  withNamespaces('translations') (connect(
  mapStateToProps,
  mapDispatchToProps
)(reduxForm({
  form: 'ResetPassword',
  fields: ['oldPassword', 'newPassword', 'repeatPassword' ],
  validate
})(ResetPassword)))
