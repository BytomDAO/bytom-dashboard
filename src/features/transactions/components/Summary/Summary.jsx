import React from 'react'
import { Link } from 'react-router'
import { converIntToDec } from 'utility/buildInOutDisplay'
import { btmID } from 'utility/environment'
import styles from './Summary.scss'
import {withNamespaces} from 'react-i18next'
import { KeyValueTable } from 'features/shared/components'
import tableStyles from 'features/shared/components/TableList/TableList.scss'

const INOUT_TYPES = {
  issue: 'Issue',
  spend: 'Spend',
  control: 'Control',
  retire: 'Retire',
  vote: 'Vote',
  veto: 'Veto',
  crossOut:'Cross Out',
  crossIn:'Cross In'
}

class Summary extends React.Component {
  normalizeInouts(inouts) {
    const normalized = {}

    inouts.forEach(inout => {
      let asset = normalized[inout.assetId]
      if (!asset) asset = normalized[inout.assetId] = {
        alias: inout.assetAlias,
        decimals: (inout.assetDefinition && inout.assetDefinition.decimals && inout.assetId !== btmID)? inout.assetDefinition.decimals : null,
        issue: 0,
        retire: 0,
        crossOut:0,
        crossIn:0
      }

      if (['issue', 'retire', 'cross_chain_out', 'cross_chain_in'].includes(inout.type)) {
        switch (inout.type){
          case 'cross_chain_out':
            asset['crossOut'] += inout.amount
            break
          case 'cross_chain_in':
            asset['crossIn'] += inout.amount
            break
          default:
            asset[inout.type] += inout.amount
        }
      } else {
        let accountKey = inout.accountId || 'external'
        let account = asset[accountKey]
        if (!account) account = asset[accountKey] = {
          alias: inout.accountAlias,
          spend: 0,
          control: 0,
          vote:{},
          veto: 0
        }

        if (inout.type == 'spend') {
          account.spend += inout.amount
        } else if (inout.type == 'veto') {
          account.veto += inout.amount
        } else if (inout.type == 'control' && inout.purpose == 'change') {
          account.spend -= inout.amount
        } else if (inout.type == 'control') {
          account.control += inout.amount
        } else if (inout.type == 'vote'){
          let vote = inout.vote
          let voteObject = account['vote']
          let nodePubkey = voteObject[vote]
          if (nodePubkey === undefined) {
            voteObject[vote] = 0
          }
          voteObject[vote] += inout.amount
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
    const t = this.props.t

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

    Object.keys(summary).forEach((assetId) => {
      const asset = summary[assetId]
      const nonAccountTypes = ['issue','retire', 'crossOut', 'crossIn']

      nonAccountTypes.forEach((type) => {
        if (asset[type] > 0) {
          items.push({
            type: INOUT_TYPES[type],
            rawAction: type,
            amount: asset.decimals? converIntToDec(asset[type], asset.decimals) : normalizeBtmAmountUnit(assetId, asset[type], this.props.btmAmountUnit),
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

        const accountTypes = ['spend', 'control', 'veto']
        accountTypes.forEach((type) => {
          if (account[type] > 0) {
            items.push({
              type: INOUT_TYPES[type],
              rawAction: type,
              amount: asset.decimals? converIntToDec(account[type], asset.decimals) : normalizeBtmAmountUnit(assetId, account[type], this.props.btmAmountUnit),
              asset: asset.alias ? asset.alias : <code className={styles.rawId}>{assetId}</code>,
              assetId: assetId,
              account: account.alias ? account.alias : <code className={styles.rawId}>{accountId}</code>,
              accountId: accountId,
            })
          }
        })

        if(!_.isEmpty(account['vote'])){
          let nodePubkeyArray = account.vote
          for (const nodePubkey of Object.keys(nodePubkeyArray)) {
            let amount = nodePubkeyArray[nodePubkey]
            let type = 'vote'
            items.push({
              type: INOUT_TYPES[type],
              rawAction: type,
              amount: asset.decimals? converIntToDec(amount, asset.decimals) : normalizeBtmAmountUnit(assetId, amount, this.props.btmAmountUnit),
              asset: asset.alias ? asset.alias : <code className={styles.rawId}>{assetId}</code>,
              assetId: assetId,
              account: account.alias ? account.alias : <code className={styles.rawId}>{accountId}</code>,
              accountId: accountId,
              nodePubkey: <code className={styles.rawId}>{nodePubkey}</code>
            })
          }
        }

      })
    })

    const ordering = ['issue', 'spend', 'crossIn', 'veto', 'control', 'retire', 'vote', 'crossOut']
    items.sort((a,b) => {
      return ordering.indexOf(a.rawAction) - ordering.indexOf(b.rawAction)
    })
    
    return (
      <div style={{marginTop: '24px'}}>
        {items.map((item, index) => {
          return (
            <div className={tableStyles.tr} key={index}>
              <div className={tableStyles.td}>
                { !isCoinbase  
                  ? <span className={tableStyles.value}>{item.type}</span>  
                  : (
                    <div>
                      <span className={tableStyles.label}>Coinbase</span>
                      {!mature && <small className={styles.immature}>{ t('transaction.type.immature') }</small>}
                    </div>
                  )
                }
              </div>
              <div className={tableStyles.td} style={{ minWidth: '160px' }}>
                <span className={tableStyles.label}>{ t('form.amount') }</span>
                <span className={`${tableStyles.value}`}>{item.amount}</span>
              </div>
              <div className={tableStyles.td}>
                <span className={tableStyles.label}>{ t('form.asset') }</span>
                <span className={`${tableStyles.value}`}>
                  <Link to={`/assets/${item.assetId}`}>
                    {item.asset}
                  </Link>
                </span>
              </div>
              <div className={tableStyles.td}>
                <span className={tableStyles.label}>{ t('form.account') }</span>
                <span className={`${tableStyles.value}`}>
                  {item.accountId 
                    ? <Link to={`/accounts/${item.accountId}`}>
                      {item.account}
                    </Link>
                    : item.account
                  }
                </span>
              </div>
            </div>
          )
        })}
      </div>
    )

    // return(<table className={styles.main}>
    //   <tbody>
    //     {items.map((item, index) =>
    //       <tr key={index}>
    //         {
    //           !isCoinbase && <td className={styles.colAction}>{item.type}</td>
    //         }
    //         {
    //           isCoinbase && <td className={styles.colAction}>
    //             Coinbase
    //             {!mature && <small className={styles.immature}>{ t('transaction.type.immature') }</small>}
    //           </td>
    //         }
    //         <td className={styles.colLabel}>{ t('form.amount') }</td>
    //         <td className={item.rawAction==='vote'? styles.colVote: styles.colAmount}>
    //           <code className={styles.amount}>{item.amount}</code>
    //         </td>
    //         <td className={styles.colLabel}>{ t('form.asset') }</td>
    //         <td className={item.rawAction==='vote'? styles.colVote: styles.colAccount}>
    //           <Link to={`/assets/${item.assetId}`}>
    //             {item.asset}
    //           </Link>
    //         </td>
    //         <td className={styles.colLabel}>{item.account && t('form.account')}</td>
    //         <td className={item.rawAction==='vote'? styles.colVote: styles.colAccount}>
    //           {item.accountId && <Link to={`/accounts/${item.accountId}`}>
    //             {item.account}
    //           </Link>}
    //           {!item.accountId && item.account}
    //         </td>
    //         {item.rawAction ==='vote'? [<td className={`${styles.colLabel} ${styles.nodePubkey}`}> {t('form.vote')}</td>,
    //           <td className={styles.colVote}>{item.nodePubkey}
    //           </td>]:[<td></td>,<td></td>]}
    //       </tr>
    //     )}
    //   </tbody>
    // </table>)
  }
}

export default withNamespaces('translations') (Summary)
