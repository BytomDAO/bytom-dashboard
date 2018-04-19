import React from 'react'
import { connect } from 'react-redux'
import { ErrorBanner, TextField } from 'features/shared/components'
import actions from 'actions'
import styles from './Register.scss'
import { reduxForm } from 'redux-form'

class Register extends React.Component {
  constructor(props) {
    super(props)

    this.submitWithErrors = this.submitWithErrors.bind(this)
  }

  submitWithErrors(data) {
    return new Promise((resolve, reject) => {
      this.props.registerKey(data)
        .catch((err) => reject({_error: err.message}))
    })
  }

  render() {
    const lang =this.props.lang

    const {
      fields: { keyAlias, password, repeatPassword, accountAlias },
      error,
      handleSubmit,
      submitting
    } = this.props

    return (
      <div className={styles.main}>
        <h2 className={styles.title}>{lang==='zh'? '初始账户和密钥':'Init your account and key'}</h2>
        <div className={styles.form}>
          <form onSubmit={handleSubmit(this.submitWithErrors)}>
            <TextField
              title={lang==='zh'? '账户别名':'Account Alias'}
              placeholder={lang==='zh'? '请输入账户别名...':'Please enter the account alias...'}
              fieldProps={accountAlias}
              autoFocus={true} />
            <TextField
              title={lang==='zh'? '密钥别名':'Key Alias'}
              placeholder={lang==='zh'? '请输入密钥别名...':'Please enter the key alias...'}
              fieldProps={keyAlias} />
            <TextField
              title={lang==='zh'? '密码':'Password'}
              placeholder={lang==='zh'? '请输入密钥密码...':'Please enter the key password...'}
              fieldProps={password}
              type='password' />
            <TextField
              title={lang==='zh'? '重复输入密码':'Repeat your password'}
              placeholder={lang==='zh'? '请重复输入密钥密码...':'Please repeat the key password...'}
              fieldProps={repeatPassword}
              type='password' />

            {error &&
              <ErrorBanner
                title='Error in Init Account..'
                error={error} />}

            <button type='submit' className='btn btn-primary' disabled={submitting}>
              {lang==='zh'? '注册':'Register'}
            </button>
          </form>
        </div>
      </div>
    )
  }
}

const validate = values => {
  const errors = {}

  if (!values.keyAlias) {
    errors.keyAlias = 'Key alias is required'
  }
  if (!values.password) {
    errors.password = 'Password is required'
  }else if( values.password.length < 5 ) {
    errors.password = 'Please enter at least 5 characters password.'
  }
  if ( values.password !== values.repeatPassword ) {
    errors.repeatPassword = 'Please match the repeat password.'
  }
  if (!values.accountAlias) {
    errors.accountAlias = 'Account alias is required'
  }

  return errors
}

export default connect(
  (state) => ({
    lang: state.core.lang
  }),
  (dispatch) => ({
    registerKey: (token) => dispatch(actions.core.registerKey(token))
  })
)(reduxForm({
  form: 'initDefaultPassword',
  fields: ['keyAlias', 'password', 'repeatPassword', 'accountAlias' ],
  validate
})(Register))
