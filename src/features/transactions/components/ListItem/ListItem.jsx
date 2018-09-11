import React from 'react'
import { Link } from 'react-router'
import { DetailSummary } from 'features/transactions/components'
import { RelativeTime } from 'features/shared/components'
import styles from './ListItem.scss'

class ListItem extends React.Component {
  render() {
    const item = this.props.item
    const lang = this.props.lang
    const confirmation = item.highest - item.blockHeight + 1
    item.confirmations = confirmation

    const immatured = confirmation> 0 && confirmation<100

    const unconfirmedTx = item.blockHeight === 0 && item.blockHash === '0000000000000000000000000000000000000000000000000000000000000000'


    const confirmView =(<span>
          <span className={immatured? 'text-danger': null}>{confirmation}</span>
      {lang === 'zh' ? ` 确认数${immatured?' (100)': ''}` :' of 100 confirmations'}
      </span>)

    return(
      <div className={styles.main}>
        <div className={styles.titleBar}>
          <div className={styles.title}>
            <label>{lang === 'zh' ? '交易ID:' : 'Tx ID:'}</label>
            &nbsp;<code>{item.id}</code>&nbsp;

            <span className={`${styles.confirmation} ${unconfirmedTx?'text-danger': null}`}>
              {
                unconfirmedTx ?
                  (lang === 'zh' ? '未确认交易' : 'unconfirmed Transaction'):
                  confirmView
              }
            </span>

          </div>
          {unconfirmedTx? null : <span className={styles.timestamp}>
              <RelativeTime timestamp={item.timestamp} />
            </span>}
          <Link className={styles.viewLink} to={`/transactions/${item.id}`}>
            {lang === 'zh' ? '查看详情' : 'View details'}
          </Link>
        </div>

        <DetailSummary transaction={item} lang={lang} btmAmountUnit={this.props.btmAmountUnit}/>

      </div>
    )
  }
}

export default ListItem
