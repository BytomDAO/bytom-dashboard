import React from 'react'
import { BaseList, PaginationField } from 'features/shared/components'
import ListItem from './ListItem'
import {UTXOpageSize} from '../../../utility/environment'

const type = 'unspent'

class List extends React.Component {
  render() {
    const ItemList = BaseList.ItemList
    return <div>
      <ItemList {...this.props}/>
      {!this.props.noResults && <PaginationField
        currentPage={this.props.currentPage}
        isLastPage={this.props.isLastPage}
        pushList={this.props.pushList}/>}
    </div>
  }
}

const newStateToProps = (state, ownProps) => ({
  ...mapStateToProps(type, ListItem)(state, ownProps),
  skipCreate: true,
  label: 'unspent outputs'
})

export default BaseList.connect(
  newStateToProps,
  BaseList.mapDispatchToProps(type),
  List
)

const mapStateToProps = (type, itemComponent, additionalProps = {}) => {
  return (state, ownProps) => {
    const currentPage = Math.max(parseInt(ownProps.location.query.page) || 1, 1)
    const totalItems = state[type].items
    const keysArray = Object.keys(totalItems)
    const lastPageIndex = Math.ceil(keysArray.length/UTXOpageSize) - 1
    const isLastPage = ((currentPage - 1) == lastPageIndex)
    const startIndex = (currentPage - 1) * UTXOpageSize
    const currentItems = keysArray.slice(startIndex, startIndex + UTXOpageSize).map(
      id => totalItems[id]
    ).filter(item => item != undefined)

    return {
      currentPage: currentPage,
      isLastPage: isLastPage,
      items: currentItems,
      loadedOnce: state[type].queries.loadedOnce,
      type: type,
      listItemComponent: itemComponent,
      noResults: currentItems.length == 0,
      showFirstTimeFlow: currentItems.length == 0,
      ...additionalProps
    }
  }
}
