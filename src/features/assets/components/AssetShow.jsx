import React from 'react'
import {
  BaseShow,
  PageContent,
  PageTitle,
  KeyValueTable,
  RawJsonButton,
} from 'features/shared/components'
import componentClassNames from 'utility/componentClassNames'
import { withNamespaces } from 'react-i18next'

class AssetShow extends BaseShow {
  render() {
    const { item, t } = this.props

    let view
    if (item) {
      const title = <span>
        { t('asset.asset') }
        <code>{item.alias ? item.alias :item.id}</code>
      </span>

      view = <div className={componentClassNames(this)}>
        <PageTitle title={title} />

        <PageContent>
          <KeyValueTable
            id={item.id}
            object='asset'
            title={t('form.detail')}
            actions={[
              // <button key='show-circulation' className='btn btn-link' onClick={this.props.showCirculation.bind(this, item)}>
              //  Circulation
              // </button>,
              <RawJsonButton key='raw-json' item={item} />
            ]}
            items={[
              {label: 'ID', value: item.id},
              {label: t('form.alias'), value: item.alias, editUrl: item.alias === 'BTM' ? null : `/assets/${item.id}/alias`},
              {label: t('form.definition'), value: item.definition},
              {label: t('form.xpubs'), value: (item.xpubs || []).length},
              {label: t('form.quorum'), value: item.quorum},
            ]}
          />

          {(item.xpubs || []).map((key, index) =>
            <KeyValueTable
              key={index}
              title={t('asset.xpubs', {id: index + 1})}
              items={[
                {label: t('form.index') , value: index},
                {label: t('asset.assetPub') , value: key},
              ]}
            />
          )}
        </PageContent>
      </div>
    }
    return this.renderIfFound(view)
  }
}

// Container

import { connect } from 'react-redux'
import actions from 'actions'

const mapStateToProps = (state, ownProps) => ({
  item: state.asset.items[ownProps.params.id],
})

const mapDispatchToProps = ( dispatch ) => ({
  fetchItem: (id) => dispatch(actions.asset.fetchItems({id: `${id}`})),
  showCirculation: (item) => {
    let filter = `id='${item.id}'`
    if (item.alias) {
      filter = `alias='${item.alias}'`
    }

    dispatch(actions.balance.pushList({ filter }))
  },
})


export default withNamespaces('translations') ( connect(
  mapStateToProps,
  mapDispatchToProps
)(AssetShow))
