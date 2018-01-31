import { BaseList, TableList } from 'features/shared/components'
import ListItem from './ListItem'
import { chainClient } from 'utility/environment'
import { store } from 'app'

const type = 'key'

class KeyList extends BaseList.ItemList {
  constructor(props) {
    super(props)
    const client = chainClient()

    this.setStat = () => client.mockHsm.keys.progress().then(({data}) => {
      store.dispatch({
        type: 'RECEIVED_IMPORT_STATUS',
        data
      })

      if ((data || []).filter(item => !item.complete).length > 0) {
        window.setTimeout(this.setStat, 5000)
      }
    })

    this.setStat()
  }
}

export default BaseList.connect(
  BaseList.mapStateToProps(type, ListItem, {
    skipQuery: true,
    label: 'Keys',
    wrapperComponent: TableList,
    wrapperProps: {
      titles: ['Alias', 'xpub']
    }
  }),
  BaseList.mapDispatchToProps(type),
  KeyList
)
