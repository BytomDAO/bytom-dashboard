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

    const labelTitleMap = {
      transactions: 'Transactions',
      accounts: 'Accounts',
      assets: 'Assets',
      balances: 'Balances',
      'unspent outputs': 'UTXO'
    }
    const title = labelTitleMap[label] || capitalize(label)

    const newButton = <button key='showCreate' className='btn btn-primary' onClick={this.props.showCreate}>
      + {'New'}
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
        <this.props.listItemComponent key={item.id} item={item} {...this.props.itemActions}/>)
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
  let items = state[type].items
  let target = []
  for (let key in items) {
    target.push(items[key])
  }

  return {
    items: target,
    loadedOnce: state[type].queries.loadedOnce,
    type: type,
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
