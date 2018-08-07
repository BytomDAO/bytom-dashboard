import React from 'react'
import actions from 'actions'
import { connect as reduxConnect } from 'react-redux'
import { pluralize, capitalize, humanize } from 'utility/string'
import {UTXOpageSize, pageSize} from 'utility/environment'
import componentClassNames from 'utility/componentClassNames'
import { PageContent, PageTitle, Pagination } from '../'
import EmptyList from './EmptyList'

class ItemList extends React.Component {
  render() {
    const label = this.props.label || pluralize(humanize(this.props.type))
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
    const objectNameZh = {
      transactions: '交易' ,
      accounts: '账户',
      assets: '资产',
      balances: '余额' ,
      'unspent outputs': '未完成输出',
      Keys: '密钥'
    }
    const objectName = lang === 'zh' ? objectNameZh[label] :label.slice(0,-1)
    const title = labelTitleMap[label] || capitalize(label)

    const newButton = <button key='showCreate' className='btn btn-primary' onClick={this.props.showCreate}>
      + {lang === 'zh' ? '新建' : 'New'}
    </button>
    if (!this.props.skipCreate) {
      actions.push(newButton)
    }

    let header =
      <PageTitle
        title={title}
        actions={actions}
      />


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
            loadedOnce={this.props.loadedOnce}
            lang={lang} />

        </div>
      )
    } else {
      let pagination = <Pagination
        currentPage={this.props.currentPage}
        currentFilter={this.props.currentFilter}
        isLastPage={this.props.isLastPage}
        pushList={this.props.pushList} />

      const items = this.props.items.map((item) =>
        <this.props.listItemComponent
          key={item.id}
          item={item}
          lang={this.props.lang}
          btmAmountUnit={this.props.btmAmountUnit}
          {...this.props.itemActions}/>)

      const Wrapper = this.props.wrapperComponent

      return(
        <div className={rootClassNames}>
          {header}

          <PageContent>
            {Wrapper ? <Wrapper {...this.props.wrapperProps}>{items}</Wrapper> : items}

            { ( label==='transactions' || label === 'unspent outputs') && pagination}
          </PageContent>
        </div>
      )
    }
  }
}

export const mapStateToProps = (type, itemComponent, additionalProps = {}) => (state, ownProps ) => {
  const paginationArray =[ 'unspent', 'transaction' ]

  let items = Object.assign({}, state[type].items)
  const highestBlock = state.core.coreData && state.core.coreData.highestBlock
  const count = (type === 'unspent')? UTXOpageSize: pageSize

  const currentPage = paginationArray.includes(type) && Math.max(parseInt(ownProps.location.query.page) || 1, 1)

  if (type === 'key') {
    (state[type].importStatus || []).forEach(status => {
      if (items[status.xpub]) {
        Object.assign(items[status.xpub], status)
      }
    })
  }

  let target = []
  for (let key in items) {
    items[key].highest = highestBlock
    target.push(items[key])
  }

  const isLastPage = target.length <count

  return {
    items: target,
    loadedOnce: state[type].queries.loadedOnce,
    type: type,

    isLastPage: isLastPage,
    currentPage: currentPage,

    lang: state.core.lang,
    btmAmountUnit: state.core.btmAmountUnit,

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
