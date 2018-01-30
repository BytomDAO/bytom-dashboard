import React from 'react'
import { BaseList, PaginationField } from 'features/shared/components'
import ListItem from './ListItem/ListItem'
import actions from 'actions'
import { pageSize } from '../../../utility/environment'

const type = 'transaction'

class List extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.blockHeight != this.props.blockHeight) {
      if (nextProps.currentPage == 1) {
        this.props.getLatest(nextProps.currentFilter)
      }
    }
  }
  render() {
    const ItemList = BaseList.ItemList
    return <div>
      <ItemList {...this.props}/>
      {!this.props.noResults && <PaginationField
        currentPage = { this.props.currentPage }
        totalNumberPage = { this.props.totalNumberPage }
        pushList = { this.props.pushList }/>}
    </div>
  }
}

export default BaseList.connect(
  (state, ownProps) => ({
    ...mapStateToProps(type,ListItem)(state,ownProps),
    blockHeight: state.core.blockHeight
  }),
  (dispatch) => ({
    ...BaseList.mapDispatchToProps(type)(dispatch),
    getLatest: (query) => dispatch(actions.transaction.fetchPage(query, 1, { refresh: true })),
  }),
  List
)

const mapStateToProps = (type, itemComponent, additionalProps = {}) => {
  return (state, ownProps) => {
    const currentPage = Math.max(parseInt(ownProps.location.query.page) || 1, 1)
    const totalItems = state[type].items
    const keysArray = Object.keys(totalItems)
    const totalNumberPage = Math.ceil(keysArray.length/pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const currentItems = keysArray.slice(startIndex, startIndex + pageSize).map(
      id => totalItems[id]
    ).filter(item => item != undefined)

    return {
      currentPage: currentPage,
      totalNumberPage: totalNumberPage,
      items: currentItems,
      loadedOnce: state[type].queries.loadedOnce,
      type: type,
      lang: state.core.lang,
      listItemComponent: itemComponent,
      noResults: currentItems.length == 0,
      showFirstTimeFlow: currentItems.length == 0,
      ...additionalProps
    }
  }
}

