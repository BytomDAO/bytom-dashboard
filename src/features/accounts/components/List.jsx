import { BaseList, TableList } from 'features/shared/components'
import ListItem from './ListItem'
import {withNamespaces} from 'react-i18next'
import React from 'react'
import { actions } from 'features/accounts'
import styles from './List.scss'

const type = 'account'

class List extends React.Component {

  render() {
    const ItemList = BaseList.ItemList
    const items = this.props.items
    items.map(item =>{
      if(item.alias === this.props.currentAccount){
        item.isUsed = true
      }else {
        item.isUsed= false
      }
    })
    return (<ItemList {...this.props} items = {items}/>)
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    currentAccount: state.account.currentAccount,
    ...BaseList.mapStateToProps(type, ListItem, {
      wrapperComponent: TableList,
      wrapperProps: {
        titles: ownProps.t('account.formTitle',  { returnObjects: true }),
        styles: styles.main
      }
    })(state)
  }
}

const mapDispatchToProps = (dispatch) => ({
  ...BaseList.mapDispatchToProps(type)(dispatch),
  itemActions: {
    switch: (account) => dispatch(actions.switchAccount((account)))
  },
})
export default withNamespaces('translations') (BaseList.connect(
  mapStateToProps,
  mapDispatchToProps,
  (List)
))
