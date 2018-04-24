import React from 'react'
import {connect} from 'react-redux'
import {ErrorBanner, TextField} from 'features/shared/components'
import actions from 'actions'
import styles from './Register.scss'
import {reduxForm} from 'redux-form'
import {chainClient} from 'utility/environment'

class Register extends React.Component {
  constructor(props) {
    super(props)
    this.connection = chainClient().connection

    this.submitWithErrors = this.submitWithErrors.bind(this)
  }

  componentDidMount() {
    this.setState({
      init: true
    })
  }

  submitWithErrors(data) {
    return new Promise((resolve, reject) => {
      this.props.registerKey(data)
        .catch((err) => reject({_error: err.message}))
    })
  }

  setMode(isInit) {
    this.setState({
      init: isInit
    })
  }

  restore() {
    const element = document.getElementById('bytom-restore-file-upload-init')
    element.click()
  }

  handleFileChange(event) {
    const files = event.target.files
    if (files.length <= 0) {
      this.setState({key: null})
      return
    }

    const fileReader = new FileReader()
    fileReader.onload = fileLoadedEvent => {
      const backupData = JSON.parse(fileLoadedEvent.target.result)
      this.connection.request('/restore-wallet', backupData).then(resp => {
        if (resp.status === 'fail') {
          this.props.showError(new Error(resp.msg))
          return
        }
        this.props.success()
      })
    }
    fileReader.readAsText(files[0], 'UTF-8')

    const fileElement = document.getElementById('bytom-restore-file-upload-init')
    fileElement.value = ''
  }

  render() {
    const lang = this.props.lang

    const {
      fields: {keyAlias, password, repeatPassword, accountAlias},
      error,
      handleSubmit,
      submitting
    } = this.props

    return (
      <div className={styles.main}>
        {
          this.state && this.state.init &&
          <div>
            <h2 className={styles.title}>{lang === 'zh' ? '初始账户和密钥' : 'Init your account and key'}</h2>
            <div className={styles.formWarpper}>
              <form className={styles.form} onSubmit={handleSubmit(this.submitWithErrors)}>
                <TextField
                  title={lang === 'zh' ? '账户别名' : 'Account Alias'}
                  placeholder={lang === 'zh' ? '请输入账户别名...' : 'Please enter the account alias...'}
                  fieldProps={accountAlias} />
                <TextField
                  title={lang === 'zh' ? '密钥别名' : 'Key Alias'}
                  placeholder={lang === 'zh' ? '请输入密钥别名...' : 'Please enter the key alias...'}
                  fieldProps={keyAlias}/>
                <TextField
                  title={lang === 'zh' ? '密钥密码' : 'Key Password'}
                  placeholder={lang === 'zh' ? '请输入密钥密码...' : 'Please enter the key password...'}
                  fieldProps={password}
                  type='password'/>
                <TextField
                  title={lang === 'zh' ? '重复输入密钥密码' : 'Repeat your key password'}
                  placeholder={lang === 'zh' ? '请重复输入密钥密码...' : 'Please repeat the key password...'}
                  fieldProps={repeatPassword}
                  type='password'/>

                {error &&
                <ErrorBanner
                  title='Error in Init Account..'
                  error={error}/>}

                <button type='submit' className='btn btn-primary' disabled={submitting}>
                  {lang === 'zh' ? '注册' : 'Register'}
                </button>
                <a className={`${styles.choice} ${(this.state && this.state.init) ? '' : styles.active}`}
                   href='javascript:;' onClick={this.setMode.bind(this, false)}>
                  {lang === 'zh' ? '恢复钱包' : 'Restore wallet'}
                </a>
              </form>
            </div>
          </div>
        }
        {
          this.state && !this.state.init &&
          <div>
            <h2 className={styles.title}>{lang === 'zh' ? '恢复钱包' : 'Restore wallet'}</h2>
            <div className={styles.formWarpper}>
              <form className={styles.form} onSubmit={handleSubmit(this.submitWithErrors)}>
                <button className='btn btn-primary' onClick={this.restore.bind(this)}>
                  {lang === 'zh' ? '恢复' : 'Restore'}
                </button>
                <a className={`${styles.choice} ${(this.state && this.state.init) ? styles.active : ''}`}
                   href='javascript:;' onClick={this.setMode.bind(this, true)}>
                  {lang === 'zh' ? '初始账户和密钥' : 'Init your account and key'}
                </a>

                <p></p>
                {
                  lang === 'zh' && <p>点击恢复按钮，选择备份文件进行恢复</p>
                }
                {
                  lang != 'zh' && <p>Click the button, and select the backup file</p>
                }
                <input id='bytom-restore-file-upload-init' type='file' style={{'display': 'none'}}
                       onChange={this.handleFileChange.bind(this)}/>
              </form>
            </div>
          </div>
        }
      </div>
    )
  }
}

const validate = (values, props) => {
  const errors = {}
  const lang = props.lang

  if (!values.keyAlias) {
    errors.keyAlias = ( lang === 'zh' ? '密钥别名是必须项' : 'Key alias is required' )
  }
  if (!values.password) {
    errors.password = ( lang === 'zh' ? '密码是必须项' : 'Password is required' )
  } else if (values.password.length < 5) {
    errors.password = ( lang === 'zh' ? '请输入至少5位数的密码' : 'Please enter at least 5 characters password.' )
  }
  if (values.password !== values.repeatPassword) {
    errors.repeatPassword = ( lang === 'zh' ? '请重复输入刚刚所输入的密码' :  'Please match the repeat password.' )
  }
  if (!values.accountAlias) {
    errors.accountAlias = ( lang === 'zh' ? '账户别名是必须项' : 'Account alias is required' )
  }

  return errors
}

export default connect(
  (state) => ({
    lang: state.core.lang
  }),
  (dispatch) => ({
    registerKey: (token) => dispatch(actions.core.registerKey(token)),
    showError: (err) => dispatch({type: 'ERROR', payload: err}),
    success: () => dispatch({type: 'CREATE_REGISTER_ACCOUNT'})
  })
)(reduxForm({
  form: 'initDefaultPassword',
  fields: ['keyAlias', 'password', 'repeatPassword', 'accountAlias'],
  validate
})(Register))
