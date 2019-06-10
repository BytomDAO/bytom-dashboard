import React from 'react'
import { Link } from 'react-router'
import { converIntToDec } from 'utility/buildInOutDisplay'
import { btmID } from 'utility/environment'
import styles from './DetailSummary.scss'
import {withNamespaces} from 'react-i18next'

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
          control: 0,
          vote: {}
        }

        if (inout.type == 'spend') {
          account.spend += inout.amount
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
          if(!_.isEmpty(account['vote'])){
            let nodePubkeyArray = account.vote
            for (const nodePubkey of Object.keys(nodePubkeyArray)) {
              let amount = nodePubkeyArray[nodePubkey]
              items.push({
                type: 'vote',
                amount: asset.decimals? converIntToDec(amount, asset.decimals) : normalizeBtmAmountUnit(assetId, amount, this.props.btmAmountUnit),
                asset: assetAlias ? assetAlias : <code className={styles.rawId}>{assetId}</code>,
                assetId: assetId,
                account: account.alias ? account.alias : <code className={styles.rawId}>{accountId}</code>,
                accountId: accountId,
                nodePubkey: <code className={styles.rawId}>{nodePubkey}</code>
              })
            }
          }
          if(account['spend']> account['control'] && account['spend'] > 0){
            let type,
              amount = account['spend']- account['control']

            if(asset.retire === 0 ){
              type = 'sent'
            }else if(asset.retire >= amount ){
              type = 'retire'
            }else {
              type = 'retire'
              const gas = amount - asset.retire
              amount = asset.retire
              items.push({
                type: 'sent',
                amount: normalizeBtmAmountUnit(assetId, gas, this.props.btmAmountUnit),
                asset: assetAlias ? assetAlias : <code className={styles.rawId}>{assetId}</code>,
                assetId: assetId,
                account: account.alias ? account.alias : <code className={styles.rawId}>{accountId}</code>,
                accountId: accountId,
              })
            }
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

    const ordering = ['vote', 'issue','received',  'retire', 'sent']
    items.sort((a,b) => {
      return ordering.indexOf(a.type) - ordering.indexOf(b.type)
    })



    return(<div className={styles.main}>
        {items.map((item, index) =>
          <div className={styles.row} key={index}>
            <div className={`${styles.colAction} ${styles.col}`}>
              {
                isCoinbase ?
                  [<img src={require('images/transactions/coinbase.svg')}/>, t('transaction.type.coinbase'),
                  !mature && <small className={styles.immature}>{ t('transaction.type.immature') }</small>]
                :
                  [<img src={require(`images/transactions/${item.type}.svg`)}/> , t(`transaction.type.${item.type}`)]

              }
            </div>

            <div className={styles.middle}>
              <div className={styles.account}>
                {
                  item.type ==='vote' ?
                  <div className={`${styles.colLabel}  ${styles.col}`}>{t('form.account')}</div>
                  :<div className={`${styles.colLabel}  ${styles.col}`}>{item.account && item.type && ( addType.includes(item.type) ? 'To' : 'From' )}</div>
                }
                <div className={`${styles.colAccount}  ${styles.col}`}>
                  {item.accountId && <Link to={`/accounts/${item.accountId}`}>
                    {item.account}
                  </Link>}
                  {!item.accountId && item.account}
                </div>
              </div>

              {
                item.type ==='vote'&&
                  [
                    <div className={`${styles.colLabel}  ${styles.col}`}> {t('form.vote')}</div>,
                    <div className={`${styles.col}`}>{item.nodePubkey}</div>
                  ]

              }
            </div>

            <div className={styles.end}>
              <div className={`${styles.colAmount} ${styles.recievedAmount}  ${styles.col}`}>
                {
                  item.type === 'vote'?
                  <code className={ `${styles.amount} ${styles.emphasisLabel}`}> {item.amount}</code>:
                  <code className={ `${styles.amount} ${addType.includes(item.type)? styles.emphasisLabel : 'text-danger'}`}> {item.type && ( addType.includes(item.type) ? '+' : '-' )} {item.amount}</code>
                }
              </div>
              <div className={`${styles.colUnit}  ${styles.col}`}>
                <Link to={`/assets/${item.assetId}`}>
                  {item.asset}
                </Link>
              </div>
            </div>
          </div>
        )}
    </div>)
  }
}

export default withNamespaces('translations') ( DetailSummary )
