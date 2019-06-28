import React from 'react'
import { Link } from 'react-router'
import { DetailSummary } from 'features/federation/components'
import styles from './ListItem.scss'
import {withNamespaces} from 'react-i18next'
import { converIntToDec } from 'utility/buildInOutDisplay'
import { btmID } from 'utility/environment'

class ListItem extends React.Component {
  render() {
    const item = this.props.item
    const t = this.props.t

    const confirmView = item.status

    const txType = item.sourceChainName === 'vapor'?
      'crossOut':'crossIn'

    const normalizeBtmAmountUnit = (assetID, amount, btmAmountUnit) => {
      //normalize BTM Amount
      if (assetID === btmID) {
        switch (btmAmountUnit){
          case 'BTM':
            return converIntToDec(amount, 8)
          case 'mBTM':
            return converIntToDec(amount, 5)
        }
      }
      return amount
    }

    const result = item.crosschainRequests[0]

    return(
      <div className={styles.main}>
        <div className={styles.titleBar}>
          <div className={styles.title}>
            <div className={`${styles.colAction}`}>
             <img src={require(`images/transactions/${txType}.svg`)}/> { t(`transaction.type.${txType}`)}
            </div>

            <span className={`${styles.confirmation} ${confirmView ==='pending' ? 'text-danger' : null}`}>
              { t(`transaction.${confirmView}`) }
            </span>
          </div>
          <div className={styles.end}>
            {result.asset &&
            [<div className={`${styles.recievedAmount}`}>
               <code className={`${styles.emphasisLabel} ${styles.col}`}>{normalizeBtmAmountUnit(result.asset.assetId,result.amount, this.props.btmAmountUnit)}</code>
              </div>,
              <div className={`${styles.colUnit}`}>
                <Link to={`/assets/${result.asset.assetId}`}>
                  {result.asset.assetId === btmID? 'BTM': result.asset.assetId}
                </Link>
              </div>]
            }
          </div>
        </div>

        <DetailSummary transaction={item} btmAmountUnit={this.props.btmAmountUnit}/>

      </div>
    )
  }
}

export default withNamespaces('translations') (ListItem)
