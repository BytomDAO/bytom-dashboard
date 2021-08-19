import React from 'react'
import {
  BaseShow,
  PageContent,
  PageTitle,
  KeyValueTable,
  RawJsonButton,
} from 'features/shared/components'
import { Link } from 'react-router'
import componentClassNames from 'utility/componentClassNames'
import { btmID } from 'utility/environment'
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

      const time = (item.limitHeight-this.props.blockHeight) *2.5
      let assetLabel
      if(this.props.blockHeight<item.limitHeight){
        // assetLabel = <span className='text-danger'>{t('asset.issuableLabel',{time:time})}</span>
      }else if(item.limitHeight>0){
        assetLabel = <span className='text-danger'>{t('asset.noIssuableLabel')}</span>
      }

      view = <div className={componentClassNames(this)}>
        <PageTitle
          title={title}
          actions={[
            item.id!==btmID && <Link key='create-asset-btn' className='btn btn-link' to={`/transactions/create?type=issueAsset&alias=${item.alias}`}>{t('transaction.issue.issueAsset')}</Link>,
          ]}
          extraHeader={<div style={{ marginLeft: 'auto'}}><RawJsonButton key='raw-json' item={item} /></div>}
        />

        <PageContent>
          <KeyValueTable
            id={item.id}
            object='asset'
            title={t('form.detail')}
            border={false}
            items={[
              {label: 'ID', value: item.id},
              {label: t('form.alias'), value: item.alias, editUrl: item.alias === 'BTM' ? null : `/assets/${item.id}/alias`},
              {label: t('form.symbol'), value: item.definition.symbol},
              {label: t('form.decimals'), value: item.definition.decimals},
              {label: t('form.reissueTitle'), value:  (item.alias === 'BTM' || item.limitHeight > 0)? 'false ': 'true', note: assetLabel},
              {label: t('form.xpubs'), value: (item.xpubs || []).length},
              {label: t('form.quorum'), value: item.quorum},
              {label: t('asset.additionInfo'), value: item.definition.description},
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
  blockHeight: state.core.blockHeight
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
