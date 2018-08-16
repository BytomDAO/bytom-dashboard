import React from 'react'
import { Link } from 'react-router'
import {
  BaseShow,
  KeyValueTable,
  PageContent,
  PageTitle,
} from 'features/shared/components'
import  ExportKey  from './ExportKey/ExportKey'
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
              <Link key='check-password-btn' className='btn btn-link' to={`/keys/${item.id}/check-password`}>{lang === 'zh' ? '密码校验' : 'Try Password' }</Link>,
              <Link key='reset-password-btn' className='btn btn-link' to={`/keys/${item.id}/reset-password`}>{lang === 'zh' ? '重置密码' : 'Reset Password' }</Link>
            ]}
            items={[
              {label: (lang === 'zh' ? '别名' : 'Alias' ), value: item.alias},
              {label: (lang === 'zh' ? '主公钥' : 'xpub'), value: item.xpub},
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
  fetchItem: () => dispatch(actions.key.fetchItems()),
  exportKey: (item, fileName) => dispatch(actions.key.createExport(item, fileName)),
  showModal: (body) => dispatch(actions.app.showModal(
    body,
    actions.app.hideModal
  )),
})


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Show)
