import React from 'react'
import { BaseNew, FormContainer, FormSection, TextField } from 'features/shared/components'
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

  handleCheckedChange(e) {
    this.setState({
      checked: e.target.checked
    })
  }

  handleFileChange(event) {
    const files = event.target.files
    if (files.length <= 0) {
      this.setState({key: null})
      return
    }

    const fileReader = new FileReader()
    fileReader.onload = fileLoadedEvent => {
      this.setState({
        key: fileLoadedEvent.target.result
      })
    }
    fileReader.readAsText(files[0], 'UTF-8')
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
          <TextField title='Alias' placeholder='Alias' fieldProps={alias} autoFocus={true} />
          <div>
            <input type='checkbox' id='private_key_file_input'
                   checked={this.state.import}
                   onChange={this.handleCheckedChange.bind(this)}/>
            <label htmlFor='private_key_file_input'
                   style={{'marginLeft': '5px', 'userSelect': 'none'}}>
              { lang === 'zh' ? '从文件中导入' : 'import from file' }
            </label>
          </div>
          {
            this.state.checked &&
              <TextField title='Account alias' placeholder='Account alias' fieldProps={accountAlias}></TextField>
          }
          {
            this.state.checked &&
            <input type='file' style={{'display': 'flex', 'alignItems': 'center', 'fontSize': '12px'}}
                   onChange={this.handleFileChange.bind(this)}/>
          }

          <TextField title='Password' placeholder='Password' fieldProps={password} autoFocus={false} type={'password'} />
          <TextField title='Repeat Password' placeholder='Repeat Password' fieldProps={confirmPassword} autoFocus={false} type={'password'} />
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
    validate: values => {
      const errors = {}

      if (!values.alias) {
        errors.alias = 'Key alias is required'
      }
      if (!values.password) {
        errors.password = 'Password is required'
      }else if( values.password.length < 5 ) {
        errors.password = 'Please enter at least 5 characters password.'
      }
      if ( values.password !== values.confirmPassword ) {
        errors.confirmPassword = 'Please match the repeat password.'
      }

      return errors
    }
  })(New)
)
