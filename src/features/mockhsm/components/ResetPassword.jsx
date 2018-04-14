import React, {Component} from 'react'
import { reduxForm } from 'redux-form'
import { TextField } from 'features/shared/components'
import styles from './ResetPassword.scss'

class ResetPassword extends Component {
  constructor(props) {
    super(props)
    this.submitWithErrors = this.submitWithErrors.bind(this)
  }

  submitWithErrors(data, xpub) {
    return new Promise((resolve, reject) => {
      const arg = {
        'xpub': xpub,
        'old_password': data.oldPassword,
        'new_password': data.newPassword
      }
      this.props.submitForm(arg)
        .catch((err) => reject({_error: err.message}))
    })
  }

  render() {
    const item = this.props.item
    const lang = this.props.lang
    const {
      fields: { oldPassword, newPassword, repeatPassword },
      handleSubmit,
      submitting
    } = this.props

    return (
      <div className={styles.main}>
        <form onSubmit={handleSubmit(value => this.submitWithErrors(value, item.xpub))}>
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

          <button type='submit' className='btn btn-default btn-sm' disabled={submitting}>
            { lang === 'zh' ? '重置密码' : 'Reset the password' }
          </button>
        </form>
      </div>
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

export default (reduxForm({
  form: 'ResetPassword',
  fields: ['oldPassword', 'newPassword', 'repeatPassword' ],
  validate
})(ResetPassword))
