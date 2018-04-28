import { BaseList, TableList } from 'features/shared/components'
import ListItem from './ListItem'

const type = 'key'

class KeyList extends BaseList.ItemList {
}

const mapStateToProps = (state) => {
  let titles
  if(state.core.lang === 'zh'){
    titles = ['别名','主公钥']
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
