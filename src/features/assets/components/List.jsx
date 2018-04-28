import React from 'react'
import { BaseList, TableList } from 'features/shared/components'
import ListItem from './ListItem'

const type = 'asset'

const mapStateToProps = (state) => {
  let titles
  if(state.core.lang === 'zh'){
    titles = ['资产别名','资产ID']
  }else{
    titles = ['Asset Alias', 'Asset ID']
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
