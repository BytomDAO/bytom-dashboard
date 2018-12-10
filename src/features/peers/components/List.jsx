import { BaseList, TableList } from 'features/shared/components'
import ListItem from './ListItem'
import { withNamespaces } from 'react-i18next'
import styles from './List.scss'
import { actions } from 'features/peers'
import React from 'react'

const type = 'peer'

class List extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.peerCount != this.props.peerCount) {
      this.props.getLatest()
    }
  }
  render() {
    const ItemList = BaseList.ItemList
    return (<ItemList {...this.props} />)
  }
}


const mapStateToProps = (state, props) => {
  return {
    peerCount: state.core.peerCount,
    skipCreate: true,
    ...BaseList.mapStateToProps(type, ListItem, {
      wrapperComponent: TableList,
      wrapperProps: {
        titles: props.t('peers.formTitle', { returnObjects: true }),
        styles: styles.main
      }
    })(state)
  }
}

const mapDispatchToProps = ( dispatch ) => ({
  itemActions: {
    disconnect: (id) => dispatch(actions.disconnect(id))
  },
  getLatest: () => dispatch(actions.fetchAll()),
  ...BaseList.mapDispatchToProps(type),
})

export default withNamespaces('translations') (BaseList.connect(
  mapStateToProps,
  mapDispatchToProps,
  List
))
