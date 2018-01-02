import React from 'react'
import { BaseList, TableList } from 'features/shared/components'
import ListItem from './ListItem'

const type = 'key'

export default BaseList.connect(
  BaseList.mapStateToProps(type, ListItem, {
    skipQuery: true,
    label: 'Keys',
    wrapperComponent: TableList,
    wrapperProps: {
      titles: ['Alias', 'xpub']
    }
  }),
  BaseList.mapDispatchToProps(type)
)
