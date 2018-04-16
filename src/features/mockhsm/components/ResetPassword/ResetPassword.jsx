import React, {Component} from 'react'
import { reduxForm } from 'redux-form'

import { TextField, FormContainer, FormSection} from 'features/shared/components'

class ResetPassword extends Component {
  constructor(props) {
    super(props)
    this.submitWithErrors = this.submitWithErrors.bind(this)
    this.state = {}
  }

  submitWithErrors(data, xpub) {
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
    const item = this.props.item
    const lang = this.props.lang

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
      {lang === 'zh' ? '重置密钥密码 ' : 'Reset key password '}
      <code>{item.alias}</code>
    </span>

    return (
      <FormContainer
        error={error}
        label={title}
        onSubmit={handleSubmit(value => this.submitWithErrors(value, item.xpub))}
        submitting={submitting}
        submitLabel= { lang === 'zh' ? '重置密码' : 'Reset the password' }
        lang={lang}>

        <FormSection title= {lang === 'zh' ? '重置密码' : 'Reset password' }>
          <TextField
            title = { lang === 'zh' ? '原始密码' : 'Old Password' }
            placeholder={ lang === 'zh' ? '请输入原始密码' : 'Please entered the old password.' }
            fieldProps={oldPassword}
            type= 'password'
            />
          <TextField
            title = { lang === 'zh' ? '新密码' : 'New Password' }
            placeholder={ lang === 'zh' ? '请输入新密码' : 'Please entered the new password.' }
            fieldProps={newPassword}
            type= 'password'
            />
          <TextField
            title = { lang === 'zh' ? '重复新密码' : 'Repeat Password' }
            placeholder={ lang === 'zh' ? '请重复输入新密码' : 'Please repeated the new password.' }
            fieldProps={repeatPassword}
            type= 'password'
            />
        </FormSection>
      </FormContainer>
    )
  }
}

const validate = values => {
  const errors = {}
  if (!values.oldPassword) {
    errors.oldPassword = 'Required'
  }

  if (!values.newPassword) {
    errors.newPassword = 'Required'
  }else if(values.newPassword.length < 5){
    errors.newPassword = 'Please enter at least 5 characters password.'
  }

  if ( values.newPassword !== values.repeatPassword ) {
    errors.repeatPassword = 'Please match the repeat password.'
  }
  return errors
}

import {connect} from 'react-redux'
import actions from 'actions'

const mapStateToProps = (state, ownProps) => ({
  item: state.key.items[ownProps.params.id],
  lang: state.core.lang
})

const mapDispatchToProps = ( dispatch ) => ({
  fetchItem: () => dispatch(actions.key.fetchItems()),
  submitReset: (params) => dispatch(actions.key.submitResetForm(params))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(reduxForm({
  form: 'ResetPassword',
  fields: ['oldPassword', 'newPassword', 'repeatPassword' ],
  validate
})(ResetPassword))
