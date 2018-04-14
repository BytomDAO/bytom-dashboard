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
    this.showExportKey = this.showExportKey.bind(this)
    this.showResetPassword = this.showResetPassword.bind(this)
    this.state = {
      showExportKey: false,
      showResetPassword: false
    }
  }

  showExportKey(){
    this.setState({
      showExportKey: true,
      showResetPassword: false
    })
  }

  showResetPassword(){
    this.setState({
      showExportKey: false,
      showResetPassword: true
    })
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
              <button key='show-exportkey' className='btn btn-link' onClick={this.showExportKey}> {lang === 'zh' ? '导出密钥' : 'Export Key' }</button>,
              <button key='show-resetpassword' className='btn btn-link' onClick={this.showResetPassword}> {lang === 'zh' ? '重置密码' : 'Reset Password' }</button>,
            ]}
            items={[
              {label: 'Alias', value: item.alias},
              {label: 'xpubs', value: item.xpub},
            ]}
            lang={lang}
          />

          { this.state.showExportKey && <ExportKey
            key='export-key-form' // required by React
            item={item}
            lang={lang}
            exportKey={this.props.exportKey}
          /> }

          { this.state.showResetPassword && <ResetPassword
            key='reset-password-form' // required by React
            item={item}
            lang={lang}
            submitForm={this.props.submitForm}
          /> }

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
  submitForm: (params) => dispatch(actions.key.submitResetForm(params))
})


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Show)
