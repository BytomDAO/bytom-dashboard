import React from 'react'
import {
  BaseShow,
  KeyValueTable,
  PageContent,
  PageTitle,
} from 'features/shared/components'
import  ExportKey  from './ExportKey'
import  ResetPassword  from './ResetPassword'
import componentClassNames from 'utility/componentClassNames'

class Show extends BaseShow {
  constructor(props) {
    super(props)
  }

  showExportKey(item, lang){
    this.props.showModal(
      <div>
        <p>{lang === 'zh' ?  `请输入密码然后导出${item.alias}的私钥：` : `Please enter the password and export ${item.alias}'s private key:`}</p>
        <ExportKey
          key='export-key-form' // required by React
          item={item}
          lang={lang}
          exportKey={this.props.exportKey}
        />
      </div>
      )
  }

  showResetPassword(item, lang){
    this.props.showModal(
      <div>
        <p>{lang === 'zh' ?  '重置你的密钥密码，' : 'Reset your password, '}</p>
        <ResetPassword
          key='reset-password-form' // required by React
          item={item}
          lang={lang}
          submitForm={this.props.resetForm}
        />
      </div>
      )
  }

  render() {
    const item = this.props.item
    const lang = this.props.lang

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
            actions={[
              <button key='show-exportkey' className='btn btn-link' onClick={this.showExportKey.bind(this, item, lang)}> {lang === 'zh' ? '导出私钥' : 'Export Private Key' }</button>,
              <button key='show-resetpassword' className='btn btn-link' onClick={this.showResetPassword.bind(this, item, lang)}> {lang === 'zh' ? '重置密码' : 'Reset Password' }</button>,
            ]}
            items={[
              {label: 'Alias', value: item.alias},
              {label: 'xpubs', value: item.xpub},
            ]}
            lang={lang}
          />
        </PageContent>
      </div>
    }
    return this.renderIfFound(view)
  }
}

// Container

import {connect} from 'react-redux'
import actions from 'actions'

const mapStateToProps = (state, ownProps) => ({
  item: state.key.items[ownProps.params.id],
  lang: state.core.lang
})

const mapDispatchToProps = ( dispatch ) => ({
  fetchItem: (id) => dispatch(actions.key.fetchItems({id: `${id}`})),
  exportKey: (item, fileName) => dispatch(actions.key.createExport(item, fileName)),
  resetForm: (params) => dispatch(actions.key.submitResetForm(params)),
  showModal: (body) => dispatch(actions.app.showModal(
    body,
    actions.app.hideModal
  )),
})


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Show)
