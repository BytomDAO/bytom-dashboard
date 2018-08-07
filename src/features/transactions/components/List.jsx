import React from 'react'
import { BaseList, Pagination } from 'features/shared/components'
import { pageSize} from 'utility/environment'
import ListItem from './ListItem/ListItem'
import actions from 'actions'

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
    return (<ItemList {...this.props} />)
  }
}

export default BaseList.connect(
  (state, ownProps) => {

    const count = pageSize

    const isLastPage = ListItem.length < count
    return {
      ...BaseList.mapStateToProps(type, ListItem)(state, ownProps),
      // currentPage: Math.max(parseInt(ownProps.location.query.page) || 1, 1),
      // isLastPage: isLastPage,
  }},
  (dispatch) => ({
    ...BaseList.mapDispatchToProps(type)(dispatch),
    getLatest: (query) => dispatch(actions.transaction.fetchPage(query, 1, { refresh: true })),
  }),
  List
)

