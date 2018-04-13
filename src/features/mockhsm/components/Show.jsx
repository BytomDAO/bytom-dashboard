import React from 'react'
import {
  BaseShow,
  KeyValueTable,
  PageContent,
  PageTitle,
  TextField
} from 'features/shared/components'
import componentClassNames from 'utility/componentClassNames'

class Show extends BaseShow {
  constructor(props) {
    super(props)
    this.submitWithErrors = this.submitWithErrors.bind(this)
  }

  submitExportFileWithErrors(data, item) {
    return new Promise((resolve, reject) => {
      const arg = {
        'xpub': item.xpub,
        'password': data.exportsPassword
      }
      this.props.exportKey(arg, item.alias)
        .catch((err) => reject({_error: err.message}))
    })
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
      fields: { exportsPassword, oldPassword, newPassword, repeatPassword },
      handleSubmit,
      submitting
    } = this.props

    let view
    if (item) {
      const title = <span>
        {lang === 'zh' ? '密钥' : 'Keys '}
        <code>{item.alias ? item.alias : item.id}</code>
      </span>

      view = <div className={componentClassNames(this)}>
        <PageTitle
          title={title}
        />

        <PageContent>
          <KeyValueTable
            id={item.id}
            object='key'
            title={lang === 'zh' ? '详情' : 'Details'}
            items={[
              {label: 'Alias', value: item.alias},
              {label: 'xpubs', value: item.xpub},
            ]}
            lang={lang}
          />

          <h5>Export private key</h5>
          <form onSubmit={handleSubmit(value => this.submitExportFileWithErrors(value, item))}>
            <TextField
              title = 'Password'
              placeholder='Please entered the password.'
              fieldProps={exportsPassword}
              autoFocus={true} />
            <button type='submit' className='btn btn-primary' disabled={submitting}>
              { lang === 'zh' ? '导出私钥' : 'Export private key' }</button>
          </form>

          <h5>Reset password</h5>
          <form onSubmit={handleSubmit(value => this.submitWithErrors(value, item.xpub))}>
            <TextField
              title = 'Old Password'
              placeholder='Please entered the old password.'
              fieldProps={oldPassword}
              autoFocus={true} />
            <TextField
              title = 'New Password'
              placeholder='Please entered the new password.'
              fieldProps={newPassword}
              autoFocus={true} />
            <TextField
              title = 'Repeat Password'
              placeholder='Please repeated the new password.'
              fieldProps={repeatPassword}
              autoFocus={true} />

            <button type='submit' className='btn btn-primary' disabled={submitting}>
              Reset the password
            </button>
          </form>
        </PageContent>
      </div>
    }
    return this.renderIfFound(view)
  }
}

// Container

import {connect} from 'react-redux'
import actions from 'actions'
import {reduxForm} from 'redux-form'

const mapStateToProps = (state, ownProps) => ({
  item: state.key.items[ownProps.params.id],
  lang: state.core.lang
})

const mapDispatchToProps = ( dispatch ) => ({
  fetchItem: (id) => dispatch(actions.key.fetchItems({id: `${id}`})),
  exportKey: (item, fileName) => dispatch(actions.key.createExport(item, fileName)),
  submitForm: (params) => dispatch(actions.key.submitResetForm(params))
})


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(reduxForm({
  form: 'ResetPassword',
  fields: ['exportsPassword', 'oldPassword', 'newPassword', 'repeatPassword' ],
})(Show))
