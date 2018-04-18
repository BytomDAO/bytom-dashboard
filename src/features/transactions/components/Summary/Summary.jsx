import React from 'react'
import { Link } from 'react-router'
import { converIntToDec } from 'utility/buildInOutDisplay'
import styles from './Summary.scss'

const INOUT_TYPES = {
  issue: 'Issue',
  spend: 'Spend',
  control: 'Control',
  retire: 'Retire',
}

class Summary extends React.Component {
  normalizeInouts(inouts) {
    const normalized = {}

    inouts.forEach(inout => {
      let asset = normalized[inout.assetId]
      if (!asset) asset = normalized[inout.assetId] = {
        alias: inout.assetAlias,
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
    const confirmation = item.highest - item.blockHeight + 1
    const isCoinbase = item.inputs.length > 0 && item.inputs[0].type === 'coinbase'
    const mature = isCoinbase && confirmation >= 100

    const inouts = this.props.transaction.inputs.concat(this.props.transaction.outputs)
    const summary = this.normalizeInouts(inouts)
    const items = []

    const normalizeBtmAmountUnit = (assetID, amount, btmAmountUnit) => {
      //normalize BTM Amount
      if (assetID === 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff') {
        switch (btmAmountUnit){
          case 'BTM':
            return converIntToDec(amount, 8)
          case 'mBTM':
            return converIntToDec(amount, 5)
        }
      }
      return amount
    }

    Object.keys(summary).forEach((assetId) => {
      const asset = summary[assetId]
      const nonAccountTypes = ['issue','retire']

      nonAccountTypes.forEach((type) => {
        if (asset[type] > 0) {
          items.push({
            type: INOUT_TYPES[type],
            rawAction: type,
            amount: normalizeBtmAmountUnit(assetId, asset[type], this.props.btmAmountUnit),
            asset: asset.alias ? asset.alias : <code className={styles.rawId}>{assetId}</code>,
            assetId: assetId,
          })
        }
      })


      Object.keys(asset).forEach((accountId) => {
        if (nonAccountTypes.includes(accountId)) return
        const account = asset[accountId]
        if (!account) return

        if (accountId == 'external') {
          account.alias = 'external'
          accountId = null
        }

        const accountTypes = ['spend', 'control']
        accountTypes.forEach((type) => {
          if (account[type] > 0) {
            items.push({
              type: INOUT_TYPES[type],
              rawAction: type,
              amount: normalizeBtmAmountUnit(assetId, account[type], this.props.btmAmountUnit),
              asset: asset.alias ? asset.alias : <code className={styles.rawId}>{assetId}</code>,
              assetId: assetId,
              direction: type == 'spend' ? 'from' : 'to',
              account: account.alias ? account.alias : <code className={styles.rawId}>{accountId}</code>,
              accountId: accountId,
            })
          }
        })
      })
    })

    const ordering = ['issue', 'spend', 'control', 'retire']
    items.sort((a,b) => {
      return ordering.indexOf(a.rawAction) - ordering.indexOf(b.rawAction)
    })

    return(<table className={styles.main}>
      <tbody>
        {items.map((item, index) =>
          <tr key={index}>
            {
              !isCoinbase && <td className={styles.colAction}>{item.type}</td>
            }
            {
              isCoinbase && <td className={styles.colAction}>
                Coinbase
                {!mature && <small className={styles.unmature}>unmature</small>}
              </td>
            }
            <td className={styles.colLabel}>amount</td>
            <td className={styles.colAmount}>
              <code className={styles.amount}>{item.amount}</code>
            </td>
            <td className={styles.colLabel}>asset</td>
            <td className={styles.colAccount}>
              <Link to={`/assets/${item.assetId}`}>
                {item.asset}
              </Link>
            </td>
            <td className={styles.colLabel}>{item.account && 'account'}</td>
            <td className={styles.colAccount}>
              {item.accountId && <Link to={`/accounts/${item.accountId}`}>
                {item.account}
              </Link>}
              {!item.accountId && item.account}
            </td>
          </tr>
        )}
      </tbody>
    </table>)
  }
}

export default Summary
