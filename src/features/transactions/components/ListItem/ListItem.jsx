import React from 'react'
import { Link } from 'react-router'
import { DetailSummary } from 'features/transactions/components'
import { RelativeTime } from 'features/shared/components'
import styles from './ListItem.scss'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

class ListItem extends React.Component {
  render() {
    const item = this.props.item
    const lang = this.props.lang
    const confirmation = item.highest - item.blockHeight + 1
    item.confirmations = confirmation

    const isCoinbase = item.inputs.length > 0 && item.inputs[0].type === 'coinbase'

    const unconfirmedTx = item.blockHeight === 0 && item.blockHash === '0000000000000000000000000000000000000000000000000000000000000000'

    const confirmView =(confirmation<=6?
        [confirmation, (lang === 'zh' ? ' 确认数' :` confirmation${confirmation>1?'s':''}`)]
      :
      (lang === 'zh' ? '已确认': 'confirmed'))

    const tooltip = (
      <Tooltip id='tooltip'>
        {lang === 'zh' ? '合约运行状态' : 'Contract Execution Status'}
      </Tooltip>
    )

    const icon = <OverlayTrigger placement='top' overlay={tooltip}>
      <img src={require(`images/transactions/${item.statusFail?'fail': 'success'}.svg`)}/>
    </OverlayTrigger>

    return(
      <div className={styles.main}>
        <div className={styles.titleBar}>
          <div className={styles.title}>
            <label>{lang === 'zh' ? '交易ID:' : 'Tx ID:'}</label>
            &nbsp;<code>{item.id}</code>&nbsp;

            {!isCoinbase && <span className={`${styles.confirmation} ${unconfirmedTx ? 'text-danger' : null}`}>
              {
                unconfirmedTx ?
                  (lang === 'zh' ? '未确认交易' : 'unconfirmed Transaction') :
                  [confirmView, icon]
              }
            </span>
            }
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
