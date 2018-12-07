import { BaseList, TableList } from 'features/shared/components'
import ListItem from './ListItem'
import { withNamespaces } from 'react-i18next'
import styles from './List.scss'
import { actions } from 'features/peers'

const type = 'peer'

const mapStateToProps = (state, props) => {
  return {
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
  ...BaseList.mapDispatchToProps(type),
})

export default withNamespaces('translations') (BaseList.connect(
  mapStateToProps,
  mapDispatchToProps
))
