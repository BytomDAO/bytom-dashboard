import { BaseList, TableList } from 'features/shared/components'

import ListItem from './ListItem'

const type = 'account'

const mapStateToProps = (state) => {
  let titles
  if(state.core.lang === 'zh'){
    titles = ['账户别名','账户ID']
  }else{
    titles = ['Account Alias', 'Account ID']
  }

  return {
    ...BaseList.mapStateToProps(type, ListItem, {
      wrapperComponent: TableList,
      wrapperProps: {
        titles: titles
      }
    })(state)
  }
}
export default BaseList.connect(
  mapStateToProps,
  BaseList.mapDispatchToProps(type)
)
