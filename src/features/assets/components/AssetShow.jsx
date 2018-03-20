import React from 'react'
import {
  BaseShow,
  PageContent,
  PageTitle,
  KeyValueTable,
  RawJsonButton,
} from 'features/shared/components'
import componentClassNames from 'utility/componentClassNames'

class AssetShow extends BaseShow {
  render() {
    const item = this.props.item
    const lang = this.props.lang

    let view
    if (item) {
      const title = <span>
        { lang === 'zh' ? '资产' :'Asset ' }
        <code>{item.alias ? item.alias :item.id}</code>
      </span>

      view = <div className={componentClassNames(this)}>
        <PageTitle title={title} />

        <PageContent>
          <KeyValueTable
            id={item.id}
            object='asset'
            title={ lang === 'zh' ? '详情' : 'Details' }
            actions={[
              // <button key='show-circulation' className='btn btn-link' onClick={this.props.showCirculation.bind(this, item)}>
              //  Circulation
              // </button>,
              <RawJsonButton key='raw-json' item={item} />
            ]}
            items={[
              {label: 'ID', value: item.id},
              {label: 'Alias', value: item.alias},
              {label: 'Tags', value: item.tags || {}, editUrl: `/assets/${item.id}/tags`},
              {label: 'Definition', value: item.definition},
              {label: 'xpubs', value: (item.xpubs || []).length},
              {label: 'Quorum', value: item.quorum},
            ]}
            lang={lang}
          />

          {(item.xpubs || []).map((key, index) =>
            <KeyValueTable
              key={index}
              title={`xpub ${index + 1}`}
              items={[
                {label: 'Index', value: index},
                {label: 'Asset Pubkey', value: key},
              ]}
              lang={lang}
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
  lang: state.core.lang
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


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssetShow)
