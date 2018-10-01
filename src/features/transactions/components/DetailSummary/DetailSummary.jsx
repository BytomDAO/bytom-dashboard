import React from 'react'
import { Link } from 'react-router'
import { converIntToDec } from 'utility/buildInOutDisplay'
import { btmID } from 'utility/environment'
import styles from './DetailSummary.scss'

const INOUT_TYPES_ZH = {
  issue: '创建资产',
  sent: '支出',
  received: '收入',
  retire: '销毁资产',
}

class DetailSummary extends React.Component {
  normalizeInouts(inouts) {
    const normalized = {}

    inouts.forEach(inout => {
      let asset = normalized[inout.assetId]
      if (!asset) asset = normalized[inout.assetId] = {
        alias: inout.assetAlias,
        decimals: (inout.assetDefinition && inout.assetDefinition.decimals && inout.assetId !== btmID)? inout.assetDefinition.decimals : null,
        issue: 0,
        retire: 0
      }

      if (['issue', 'retire'].includes(inout.type)) {
        asset[inout.type] += inout.amount
      } else {
        let accountKey = inout.accountId || 'external'
        let account = asset[accountKey]
        if (!account) account = asset[accountKey] = {
          alias: inout.accountAlias,
          spend: 0,
          control: 0
        }

        if (inout.type == 'spend') {
          account.spend += inout.amount
        } else if (inout.type == 'control' && inout.purpose == 'change') {
          account.spend -= inout.amount
        } else if (inout.type == 'control') {
          account.control += inout.amount
        }
      }
    })

    return normalized
  }

  render() {
    const item = this.props.transaction
    const confirmation = item.confirmations
    const isCoinbase = item.inputs.length > 0 && item.inputs[0].type === 'coinbase'
    const mature = isCoinbase && confirmation >= 100

    const inouts = this.props.transaction.inputs.concat(this.props.transaction.outputs)
    const summary = this.normalizeInouts(inouts)

    const items = []
    const lang = this.props.lang

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

    const addType =['issue','received']

    Object.keys(summary).forEach((assetId) => {
      const asset = summary[assetId]
      const nonAccountTypes = ['issue','retire']

      Object.keys(asset).forEach((accountId) => {
        if (nonAccountTypes.includes(accountId)) return
        const account = asset[accountId]
        if (!account) return

        const assetAlias = asset.alias ==='BTM'? this.props.btmAmountUnit: asset.alias
        if (accountId !== 'external') {
          if(account['spend']> account['control'] && account['spend'] > 0){
            const amount = account['spend']- account['control']
            const type = asset.retire >= amount? 'retire': 'sent'
            items.push({
              type: type,
              amount: asset.decimals? converIntToDec(amount, asset.decimals) : normalizeBtmAmountUnit(assetId, amount, this.props.btmAmountUnit),
              asset: assetAlias ? assetAlias : <code className={styles.rawId}>{assetId}</code>,
              assetId: assetId,
              account: account.alias ? account.alias : <code className={styles.rawId}>{accountId}</code>,
              accountId: accountId,
            })
          }

          if(account['spend']< account['control'] && account['control'] > 0){
            const amount = account['control']- account['spend']
            const type = asset.issue >= amount? 'issue': 'received'
            items.push({
              type: type,
              amount: asset.decimals? converIntToDec(amount, asset.decimals) : normalizeBtmAmountUnit(assetId, amount, this.props.btmAmountUnit),
              asset: assetAlias ? assetAlias : <code className={styles.rawId}>{assetId}</code>,
              assetId: assetId,
              account: account.alias ? account.alias : <code className={styles.rawId}>{accountId}</code>,
              accountId: accountId,
            })
          }
        }
      })
    })

    const ordering = ['issue','received',  'retire', 'sent']
    items.sort((a,b) => {
      return ordering.indexOf(a.type) - ordering.indexOf(b.type)
    })



    return(<table className={styles.main}>
      <tbody>
        {items.map((item, index) =>
          <tr key={index}>
            {/*<td className={styles.colLabel}><img src={require(`images/transactions/${isCoinbase?'coinbase':item.type}.svg`)}/></td>*/}
            {
              !isCoinbase && <td className={styles.colAction}>
                <img src={require(`images/transactions/${item.type}.svg`)}/> {lang==='zh'? INOUT_TYPES_ZH[item.type] : item.type}
                </td>
            }
            {
              isCoinbase && <td className={styles.colAction}>
                <img src={require('images/transactions/coinbase.svg')}/> {lang==='zh'? '挖矿收入':'coinbase'}
                {!mature && <small className={styles.immature}>{ lang === 'zh' ? '未成熟' : 'immature' }</small>}
              </td>
            }

            <td className={styles.colLabel}>{item.account && item.type && ( addType.includes(item.type) ? 'To' : 'From' )}</td>
            <td className={styles.colAccount}>
              {item.accountId && <Link to={`/accounts/${item.accountId}`}>
                {item.account}
              </Link>}
              {!item.accountId && item.account}
            </td>

            <td className={`${styles.colAmount} ${styles.recievedAmount}`}>
              <code className={ `${styles.amount} ${addType.includes(item.type)? styles.emphasisLabel : 'text-danger'}`}> {item.type && ( addType.includes(item.type) ? '+' : '-' )} {item.amount}</code>
            </td>
            <td className={styles.colUnit}>
              <Link to={`/assets/${item.assetId}`}>
                {item.asset}
              </Link>
            </td>
          </tr>
        )}
      </tbody>
    </table>)
  }
}

export default DetailSummary
