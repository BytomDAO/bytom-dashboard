import React from 'react'
import { BaseNew, FormContainer, FormSection, TextField, PasswordField } from 'features/shared/components'
import { reduxForm } from 'redux-form'

class New extends React.Component {
  constructor(props) {
    super(props)

    this.submitWithErrors = this.submitWithErrors.bind(this)
    this.state = {
      checked: false,
      key: null
    }
  }

  submitWithErrors(data) {
    return new Promise((resolve, reject) => {
      this.props.submitForm(Object.assign({}, data, {
        xprv: this.state.key,
        index: 5000
      })).catch((err) => reject({_error: err}))
    })
  }

  render() {
    const {
      fields: { alias, password, confirmPassword, accountAlias },
      error,
      handleSubmit,
      submitting
    } = this.props
    const lang = this.props.lang

    return(
      <FormContainer
        error={error}
        label={ lang === 'zh' ? '新建密钥' :'New key'}
        onSubmit={handleSubmit(this.submitWithErrors)}
        submitting={submitting}
        lang={lang}>

        <FormSection title={ lang === 'zh' ? '密钥信息' : 'Key Information' }>
          <TextField title={ lang === 'zh' ? '别名' : 'Alias'} placeholder={ lang === 'zh' ? '请输入密钥别名...' :'Please enter key alias...'} fieldProps={alias} autoFocus={true} />
          <PasswordField title={ lang === 'zh' ? '密码' : 'Password'}  placeholder={ lang === 'zh' ? '请输入密码...' : 'Please enter your password...'} fieldProps={password} autoFocus={false} />
          <PasswordField title={ lang === 'zh' ? '重复密码' : 'Repeat Password'} placeholder={ lang === 'zh' ? '请重复输入密码...' : 'Please repeat your password'} fieldProps={confirmPassword} autoFocus={false} />
        </FormSection>
      </FormContainer>
    )
  }
}

const fields = [ 'alias', 'password', 'confirmPassword', 'accountAlias' ]
export default BaseNew.connect(
  BaseNew.mapStateToProps('key'),
  BaseNew.mapDispatchToProps('key'),
  reduxForm({
    form: 'newMockHsmKey',
    fields,
    validate: (values, props) => {
      const errors = {}
      const lang = props.lang

      if (!values.alias) {
        errors.alias = ( lang === 'zh' ? '密钥别名是必须项' :'Key alias is required' )
      }
      if (!values.password) {
        errors.password = ( lang === 'zh' ? '密码是必须项' : 'Password is required' )
      }else if( values.password.length < 5 ) {
        errors.password = ( lang === 'zh' ? '请输入至少五位数的密码' : 'Please enter at least 5 characters password.' )
      }
      if ( values.password !== values.confirmPassword ) {
        errors.confirmPassword = ( lang === 'zh' ? '请重复输入你刚刚输入的密码' : 'Please match the repeat password.' )
      }

      return errors
    }
  })(New)
)
