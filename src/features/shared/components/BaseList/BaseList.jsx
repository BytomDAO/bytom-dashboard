import React from 'react'
import actions from 'actions'
import { connect as reduxConnect } from 'react-redux'
import { pluralize, capitalize, humanize } from 'utility/string'
import {UTXOpageSize, pageSize} from 'utility/environment'
import componentClassNames from 'utility/componentClassNames'
import { PageContent, PageTitle, Pagination } from '../'
import EmptyList from './EmptyList'
import {withNamespaces} from 'react-i18next'

class ItemList extends React.Component {
  render() {
    const label = this.props.label || pluralize(humanize(this.props.type))
    const type = this.props.type
    const actions = [...(this.props.actions || [])]
    const t = this.props.t

    const objectName = humanize(t(`crumbName.${type.toLowerCase()}` ))
    const title = capitalize(t(`crumbName.${type.toLowerCase()}` ) || label)

    const newButton = <button key='showCreate' className='btn btn-primary btn-large' style={{ width: '150px' }} onClick={this.props.showCreate}>
      + {t('crumbName.new')}
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
            />

        </div>
      )
    } else {
      let pagination = <Pagination
        currentPage={this.props.currentPage}
        currentFilter={this.props.currentFilter}
        isLastPage={this.props.isLastPage}
        pushList={this.props.pushList}
      />

      const items = this.props.items.map((item) =>
        <this.props.listItemComponent
          key={item.id}
          item={item}
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
  const highestBlock = state.core && state.core.highestBlock
  const count = (type === 'unspent')? UTXOpageSize: pageSize
  const currentBlock = state.core.currentBlockHeight

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

    currentBlock:currentBlock,

    isLastPage: isLastPage,
    currentPage: currentPage,

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
)(withNamespaces('translations')(component))

export default {
  mapStateToProps,
  mapDispatchToProps,
  connect,
  ItemList,
}
