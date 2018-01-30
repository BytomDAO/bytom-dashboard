import React from 'react'
import actions from 'actions'
import { connect as reduxConnect } from 'react-redux'
import { pluralize, capitalize, humanize } from 'utility/string'
import componentClassNames from 'utility/componentClassNames'
import { PageContent, PageTitle } from '../'
import EmptyList from './EmptyList'

class ItemList extends React.Component {
  render() {
    const label = this.props.label || pluralize(humanize(this.props.type))
    const objectName = label.slice(0,-1)
    const actions = [...(this.props.actions || [])]
    const lang = this.props.lang

    const labelTitleMap = {
      transactions: lang === 'zh' ? '交易' : 'Transactions',
      accounts: lang === 'zh' ? '账户' : 'Accounts',
      assets: lang === 'zh' ? '资产' : 'Assets',
      balances: lang === 'zh' ? '余额' : 'Balances',
      'unspent outputs': 'UTXO',
      Keys: lang === 'zh' ? '密钥' : 'Keys'
    }
    const title = labelTitleMap[label] || capitalize(label)

    const newButton = <button key='showCreate' className='btn btn-primary' onClick={this.props.showCreate}>
      + {lang === 'zh' ? '新建' : 'New'}
    </button>
    if (!this.props.skipCreate) {
      actions.push(newButton)
    }

    let header = <div>
      <PageTitle
        title={title}
        actions={actions}
      />
    </div>

    const rootClassNames = componentClassNames(this, 'flex-container')

    if (this.props.noResults) {
      return(
        <div className={rootClassNames}>
          {header}

          <EmptyList
            firstTimeContent={this.props.firstTimeContent}
            type={this.props.type}
            objectName={objectName}
            newButton={newButton}
            showFirstTimeFlow={this.props.showFirstTimeFlow}
            skipCreate={this.props.skipCreate}
            loadedOnce={this.props.loadedOnce} />

        </div>
      )
    } else {
      const items = this.props.items.map((item) =>
        <this.props.listItemComponent key={item.id} item={item} lang={this.props.lang} {...this.props.itemActions}/>)
      const Wrapper = this.props.wrapperComponent

      return(
        <div className={rootClassNames}>
          {header}

          <PageContent>
            {Wrapper ? <Wrapper {...this.props.wrapperProps}>{items}</Wrapper> : items}
          </PageContent>
        </div>
      )
    }
  }
}

export const mapStateToProps = (type, itemComponent, additionalProps = {}) => (state) => {
  let items = Object.assign({}, state[type].items)

  if (type === 'key') {
    (state[type].importStatus || []).forEach(status => {
      if (items[status.xpub]) {
        Object.assign(items[status.xpub], status)
      }
    })
  }

  let target = []
  for (let key in items) {
    target.push(items[key])
  }

  return {
    items: target,
    loadedOnce: state[type].queries.loadedOnce,
    type: type,
    lang: state.core.lang,
    listItemComponent: itemComponent,
    noResults: target.length == 0,
    showFirstTimeFlow: target.length == 0,

    ...additionalProps
  }
}

export const mapDispatchToProps = (type) => (dispatch) => {
  return {
    pushList: (query, pageNumber) => dispatch(actions[type].pushList(query, pageNumber)),
    showCreate: () => dispatch(actions[type].showCreate),
  }
}

export const connect = (state, dispatch, component = ItemList) => reduxConnect(
  state,
  dispatch
)(component)

export default {
  mapStateToProps,
  mapDispatchToProps,
  connect,
  ItemList,
}
