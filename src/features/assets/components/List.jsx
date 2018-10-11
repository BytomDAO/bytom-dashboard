import React from 'react'
import { BaseList, TableList } from 'features/shared/components'
import ListItem from './ListItem'
import { withNamespaces } from 'react-i18next'

const type = 'asset'

const mapStateToProps = (state, props) => {
  return {
    ...BaseList.mapStateToProps(type, ListItem, {
      wrapperComponent: TableList,
      wrapperProps: {
        titles: props.t('asset.formTitle', { returnObjects: true })
      }
    })(state)
  }
}

export default withNamespaces('translations') (BaseList.connect(
  mapStateToProps,
  BaseList.mapDispatchToProps(type)
))
