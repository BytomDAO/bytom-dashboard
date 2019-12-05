import React from 'react'
import { BaseList, TableList } from 'features/shared/components'
import ListItem from './ListItem'
import { withNamespaces } from 'react-i18next'

const type = 'asset'

const mapStateToProps = (state, props) => {
  return {
    skipCreate: true,
    ...BaseList.mapStateToProps(type, ListItem, {
      wrapperComponent: TableList,
      wrapperProps: {
        titles: props.t('asset.formTitle', { returnObjects: true })
      },
      createLabel:'新建存证方'
    })(state)
  }
}

export default withNamespaces('translations') (BaseList.connect(
  mapStateToProps,
  BaseList.mapDispatchToProps(type)
))
