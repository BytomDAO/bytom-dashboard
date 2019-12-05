import React from 'react'
import { KeyValueTable } from 'features/shared/components'
import { buildBalanceDisplay, converIntToDec } from 'utility/buildInOutDisplay'
import {withNamespaces} from 'react-i18next'
import {btmID} from '../../../utility/environment'

class ListItem extends React.Component {
  render() {
    const item  = this.props.item
    let balanceItem
    if(item) {
      const convertAmount = (amount) =>{
        return (item.assetDefinition && item.assetDefinition.decimals && item.assetId !== btmID) ?
          converIntToDec(amount, item.assetDefinition.decimals) : amount
      }
      let amount = convertAmount(item.amount)

      balanceItem = {
        amount: amount,
        assetId: item.assetId,
        assetAlias: item.assetAlias,
        accountAlias: item.accountAlias,
        accountId: item.accountId
      }
      if(item.totalVoteNumber){
        balanceItem.totalVoteNumber = convertAmount(item.totalVoteNumber)
      }
    }

    return <KeyValueTable items={buildBalanceDisplay(balanceItem, this.props.btmAmountUnit, this.props.t)} />
  }
}

export default withNamespaces('translations') (ListItem)
