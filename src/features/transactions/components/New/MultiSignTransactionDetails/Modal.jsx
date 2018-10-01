import React from 'react'
import { btmID } from 'utility/environment'
import { FieldLabel } from 'features/shared/components'
import styles from './TransactionDetails.scss'
import { normalizeGlobalBTMAmount , converIntToDec } from 'utility/buildInOutDisplay'

export default class Modal extends React.Component {
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
    const lang = this.props.lang

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
                <td className={styles.colLabel}> {lang === 'zh' ? '类型' : 'Type'}</td>
                <td><code>{inout.type}</code></td>
              </tr>
              <tr>
                <td className={styles.colLabel}> {lang === 'zh' ? '地址' : 'Address'}</td>
                <td><code>{inout.address}</code></td>
              </tr>
              <tr>
                <td className={styles.colLabel}> {lang === 'zh' ? '数量' : 'Amount'}</td>
                <td><code>{inout.amount}</code></td>
              </tr>
              <tr>
                <td className={styles.colLabel}> {lang === 'zh' ? '资产' : 'Asset'}</td>
                <td><code>{inout.assetAlias}</code></td>
              </tr>
              <tr>
                <td className={styles.colLabel}> {lang === 'zh' ? '合约程序' : 'Control Program'}</td>
                <td><code>{inout.controlProgram}</code></td>
              </tr>
            </tbody>
          </table>))

      view = (<div>
        <FieldLabel>{lang === 'zh' ? '交易内容' : 'Transaction Content'}</FieldLabel>
        <div className={styles.main}>
          <div className={styles.txID}>
            <label>{lang === 'zh' ? '详情' : 'Summary'}</label>
            <table key={'txsummary'} className={styles.table}>
              <tbody>
                <tr>
                  <td className={styles.colLabel}>
                    {lang === 'zh' ? '交易ID' : 'Transaction ID'}
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
            <label>{lang === 'zh' ? '输入' : 'Input'}</label>
            {table(inputs)}
            <label>{lang === 'zh' ? '输出' : 'Output'}</label>
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
                {lang === 'zh' ? '普通展示' : 'Normal View'}
              </button>
              <button
                className={`btn btn-default ${this.state.showJson ? 'active' : null}`}
                onClick={(e) => this.showForm(e, 'json')}>
                {lang === 'zh' ? 'Json格式' : 'Json View'}
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
