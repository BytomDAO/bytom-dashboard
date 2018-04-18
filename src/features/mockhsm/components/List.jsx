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

      const isImporting = item => {
        return typeof item.percent === 'number' && item.percent < 100
      }

      if ((data || []).filter(isImporting).length > 0) {
        window.setTimeout(this.setStat, 5000)
      }
    })

    this.setStat()
  }
}

const mapStateToProps = (state) => {
  let titles
  if(state.core.lang === 'zh'){
    titles = ['别名','扩展公钥']
  }else{
    titles = ['Alias', 'xpub']
  }

  return {
    ...BaseList.mapStateToProps(type, ListItem, {
      skipQuery: true,
      label: 'Keys',
      wrapperComponent: TableList,
      wrapperProps: {
        titles: titles
      }
    })(state)
  }
}

export default BaseList.connect(
  mapStateToProps,
  BaseList.mapDispatchToProps(type),
  KeyList
)
