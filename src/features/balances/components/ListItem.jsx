import React from 'react'
import { KeyValueTable } from 'features/shared/components'
import { buildBalanceDisplay } from 'utility/buildInOutDisplay'
import {withNamespaces} from 'react-i18next'

class ListItem extends React.Component {
  render() {
    return <KeyValueTable items={buildBalanceDisplay(this.props.item, this.props.btmAmountUnit, this.props.t)} />
  }
}

export default withNamespaces('translations') (ListItem)
