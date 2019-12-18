import React from 'react'
import { Link } from 'react-router'
import { DetailSummary } from 'features/transactions/components'
import { RelativeTime } from 'features/shared/components'
import styles from './ListItem.scss'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import {withNamespaces} from 'react-i18next'

class ListItem extends React.Component {
  render() {
    const item = this.props.item
    const t = this.props.t
    // const confirmation = item.highest - item.blockHeight + 1
    const confirmation = item.highest - item.blockHeight + 1
    item.confirmations = confirmation

    const isCoinbase = item.inputs.length > 0 && item.inputs[0].type === 'coinbase'

    const unconfirmedTx = item.blockHeight === 0 && item.blockHash === '0000000000000000000000000000000000000000000000000000000000000000'

    const confirmView =(confirmation<=6?
        t('transaction.confirmation', {count: confirmation})
      :
      t('transaction.confirmed'))

    const tooltip = (
      <Tooltip id='tooltip'>
        {t('transaction.contractStatus')}
      </Tooltip>
    )

    const icon = <OverlayTrigger placement='top' overlay={tooltip}>
      <img src={require(`images/transactions/${item.statusFail?'fail': 'success'}.svg`)}/>
    </OverlayTrigger>

    return(
      <div className={styles.main}>
        <div className={styles.titleBar}>
          <div className={styles.title}>
            <label>{t('transaction.id')}</label>
            &nbsp;<code>{item.id}</code>&nbsp;

            {!isCoinbase && <span className={`${styles.confirmation} ${unconfirmedTx ? 'text-danger' : null}`}>
              {
                unconfirmedTx ?
                  t('transaction.unconfirmedTx') :
                  [confirmView, icon]
              }
            </span>
            }
          </div>

          {unconfirmedTx? null : <span className={styles.timestamp}>
              <RelativeTime timestamp={item.timestamp} />
            </span>}

          <Link className={styles.viewLink} to={`/transactions/${item.id}`}>
            {t('commonWords.viewDetails')}
          </Link>
        </div>

        <DetailSummary transaction={item} btmAmountUnit={this.props.btmAmountUnit}/>

      </div>
    )
  }
}

export default withNamespaces('translations') (ListItem)
