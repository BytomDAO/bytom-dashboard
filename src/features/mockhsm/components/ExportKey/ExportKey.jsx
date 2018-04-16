import React,  { Component }  from 'react'
import { TextField } from 'features/shared/components'
import { reduxForm } from 'redux-form'
import styles from './ExportKey.scss'

class ExportKey extends Component {
  constructor(props) {
    super(props)
    this.submitWithErrors = this.submitWithErrors.bind(this)
  }

  submitWithErrors(data, item) {
    return new Promise((resolve, reject) => {
      const arg = {
        'xpub': item.xpub,
        'password': data.password
      }
      this.props.exportKey(arg, item.alias)
        .catch((err) => reject({_error: err.message}))
    })
  }

  render() {
    const item = this.props.item
    const lang = this.props.lang
    const {
      fields: { password },
      handleSubmit,
      submitting
    } = this.props

    return (
      <div className={styles.main}>
        <form
          onSubmit={handleSubmit(value => this.submitWithErrors(value, item))}
        >
          <TextField
            title = { lang === 'zh' ? '密码' : 'Password' }
            placeholder= { lang === 'zh' ? '请输入密码' : 'Please entered the password.' }
            fieldProps={password}
            type= 'password'
            />
          <button type='submit' className='btn btn-default btn-sm' disabled={submitting}>
            { lang === 'zh' ? '导出私钥' : 'Export private key' }</button>
        </form>
      </div>
     )
  }
}

const validate = values => {
  const errors = {}
  if (!values.password) {
    errors.password = 'Required'
  }
  return errors
}

export default (reduxForm({
  form: 'ExportKey',
  fields: ['password'],
  validate
})(ExportKey))
