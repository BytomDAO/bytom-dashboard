import { BaseList, TableList } from 'features/shared/components'
import ListItem from './ListItem'
import {withNamespaces} from 'react-i18next'

const type = 'key'

class KeyList extends BaseList.ItemList {
}

const mapStateToProps = (state, props) => {
  return {
    ...BaseList.mapStateToProps(type, ListItem, {
      skipQuery: true,
      label: 'Keys',
      wrapperComponent: TableList,
      wrapperProps: {
        titles: props.t('key.formTitle', { returnObjects: true })
      }
    })(state)
  }
}

export default withNamespaces('translations') (BaseList.connect(
  mapStateToProps,
  BaseList.mapDispatchToProps(type),
  KeyList
))
