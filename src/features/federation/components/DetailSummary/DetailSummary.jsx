import React from 'react'
import styles from './DetailSummary.scss'
import {withNamespaces} from 'react-i18next'
import { RelativeTime } from 'features/shared/components'

class DetailSummary extends React.Component {
  normalizeInouts(items) {
    const source = {
      chain: items.sourceChainName,
      txHash: items.sourceTxHash,
      type:'From',
      address: items.crosschainRequests[0].fromAddress,
      timestamp: items.sourceBlockTimestamp
    }

    const dest = {
      chain: items.sourceChainName === 'vapor'? 'bytom':'vapor' ,
      txHash: items.destTxHash,
      type:'To',
      address: items.crosschainRequests[0].toAddress,
      timestamp: items.destBlockTimestamp
    }

    const normalized = [source, dest]
    return normalized
  }

  render() {
    const item = this.props.transaction

    const summary = this.normalizeInouts(item)

    const t = this.props.t

    return(<div className={styles.main}>
        {summary.map((item, index) =>
          <div className={`${styles.row} ${styles.titleBar}`} key={index}>
            <div className={`${styles.title}`}>
              <label>{t('transaction.crossChainId', {id: item.chain})}
              </label>
              &nbsp;<code>{item.txHash||'-'}</code>&nbsp;
            </div>

            <div className={styles.middle}>
              <div className={styles.account}>
                  <div className={`${styles.colLabel}  ${styles.col}`}> {item.type}</div>
                  <div className={`${styles.colAccount}  ${styles.col}`}>
                      {item.address}
                  </div>
              </div>

            </div>

            <div className={styles.end}>
              <RelativeTime timestamp={item.source_block_timestamp} />
            </div>
          </div>
        )}
    </div>)
  }
}

export default withNamespaces('translations') ( DetailSummary )
