import React from 'react'
import { btmID } from 'utility/environment'
import { FieldLabel } from 'features/shared/components'
import styles from './TransactionDetails.scss'
import { normalizeGlobalBTMAmount , converIntToDec } from 'utility/buildInOutDisplay'
import {withNamespaces} from 'react-i18next'

class Modal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showJson: false
    }
    this.normalize = this.normalize.bind(this)
  }

  normalize(inouts) {
    const items = []
    let assets = this.props.asset

    inouts.forEach(inout => {
      const assetId = inout.assetId

      let filteredAsset = assets
      filteredAsset = filteredAsset.filter(asset => asset.id === assetId)

      let alias = assetId
      let amount = inout.amount

      if(filteredAsset.length === 1){
        alias =  filteredAsset[0].alias
        amount = assetId===btmID?
          normalizeGlobalBTMAmount(btmID, amount, this.props.btmAmountUnit):
          converIntToDec(amount, filteredAsset[0].definition.decimals)
      }

      items.push({
        type: inout.type,
        amount: amount,
        assetAlias: alias ,
        assetId: assetId,
        address: inout.address,
        controlProgram: inout.controlProgram
      })
    })

    return items
  }

  showForm(e, type){
    e.preventDefault()
    const showJson = (type === 'json')
    this.setState({ showJson: showJson })
  }

  render() {
    const item = this.props.transaction
    const btmAmountUnit = this.props.btmAmountUnit
    const t = this.props.t

    let view = <div></div>
    if (item.length !== 0) {
      const fee = normalizeGlobalBTMAmount(btmID, item.fee, btmAmountUnit)
      const inputs = this.normalize(item.inputs)
      const outputs = this.normalize(item.outputs)
      const table = (inouts) =>
        (inouts.map((inout, index) =>
          <table key={index} className={styles.table}>
            <tbody>
              <tr>
                <td className={styles.colLabel}> { t('form.type') }</td>
                <td><code>{inout.type}</code></td>
              </tr>
              <tr>
                <td className={styles.colLabel}> {t('form.address')}</td>
                <td><code>{inout.address}</code></td>
              </tr>
              <tr>
                <td className={styles.colLabel}> { t('form.amount') }</td>
                <td><code>{inout.amount}</code></td>
              </tr>
              <tr>
                <td className={styles.colLabel}> { t('form.asset') }</td>
                <td><code>{inout.assetAlias}</code></td>
              </tr>
              <tr>
                <td className={styles.colLabel}> { t('form.controlProgram') }</td>
                <td><code>{inout.controlProgram}</code></td>
              </tr>
            </tbody>
          </table>))

      view = (<div>
        <FieldLabel>{t('transaction.advance.transactionContent')}</FieldLabel>
        <div className={styles.main}>
          <div className={styles.txID}>
            <label>{t('form.summary')}</label>
            <table key={'txsummary'} className={styles.table}>
              <tbody>
                <tr>
                  <td className={styles.colLabel}>
                    {t('form.transactionId')}
                  </td>
                  <td>
                    <code>{item.txId}</code>
                  </td>
                </tr>
                <tr>
                  <td className={styles.colLabel}>Gas</td>
                  <td><code>{fee}</code></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <label>{t('form.input')}</label>
            {table(inputs)}
            <label>{t('form.output')}</label>
            {table(outputs)}
          </div>
        </div>
      </div>)

      const JsonView = (<pre>{JSON.stringify(this.props.transaction, null, 2)}</pre>)

      return (
        <div>
          <div className={styles.btnGroup} >
            <div className={'btn-group'} role='group'>
              <button
                className={`btn btn-default ${this.state.showJson ? null : 'active'}`}
                onClick={(e) => this.showForm(e, 'normal')}>
                {t('transaction.advance.normalView')}
              </button>
              <button
                className={`btn btn-default ${this.state.showJson ? 'active' : null}`}
                onClick={(e) => this.showForm(e, 'json')}>
                {t('transaction.advance.jsonView')}
              </button>
            </div>
          </div>

          {!this.state.showJson && view}
          {this.state.showJson && JsonView}
        </div>
      )
    }
  }
}

export default withNamespaces('translations') (Modal)
