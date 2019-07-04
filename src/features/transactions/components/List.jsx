import React from 'react'
import { BaseList } from 'features/shared/components'
import { pageSize} from 'utility/environment'
import ListItem from './ListItem/ListItem'
import actions from 'actions'

const type = 'transaction'

class List extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.currentBlock != this.props.currentBlock) {
      if (nextProps.currentPage == 1) {
        this.props.getLatest({accountAlias: this.props.accountAlias})
      }
    }
  }
  render() {
    const ItemList = BaseList.ItemList
    return (<ItemList {...this.props} />)
  }
}

export default BaseList.connect(
  (state, ownProps) => ({
    ...BaseList.mapStateToProps(type, ListItem)(state, ownProps),
    accountAlias: state.account.currentAccount,
  }),
  (dispatch) => ({
    ...BaseList.mapDispatchToProps(type)(dispatch),
    getLatest: (query) => dispatch(actions.transaction.fetchPage(query, 1, { refresh: true, pageSize: pageSize, accountAlias: query.accountAlias, unconfirmed: true })),
  }),
  List
)

