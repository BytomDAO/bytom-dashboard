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

  render() {
    const { item, t } = this.props

    let view
    if (item) {
      const title = <span>
        {t('key.keys')}
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
            title={t('form.detail')}
            actions={[
              <Link key='check-password-btn' className='btn btn-link' to={`/keys/${item.id}/check-password`}>{t('key.tryPassword') }</Link>,
              <Link key='reset-password-btn' className='btn btn-link' to={`/keys/${item.id}/reset-password`}>{t('key.resetPassword')}</Link>
            ]}
            items={[
              {label: t('form.alias'), value: item.alias, editUrl: `/keys/${item.id}/alias`},
              {label: t('key.xpub'), value: item.xpub},
            ]}
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
import {withNamespaces} from 'react-i18next'

const mapStateToProps = (state, ownProps) => ({
  item: state.key.items[ownProps.params.id],
})

const mapDispatchToProps = ( dispatch ) => ({
  fetchItem: () => dispatch(actions.key.fetchItems()),
  showModal: (body) => dispatch(actions.app.showModal(
    body,
    actions.app.hideModal
  )),
})


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces('translations')(Show))
