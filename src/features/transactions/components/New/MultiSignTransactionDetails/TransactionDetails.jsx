import React from 'react'
import pick from 'lodash/pick'
import { FieldLabel } from 'features/shared/components'
import disableAutocomplete from 'utility/disableAutocomplete'
import { btmID } from 'utility/environment'
import { normalizeGlobalBTMAmount , converIntToDec} from 'utility/buildInOutDisplay'
import styles from './TransactionDetails.scss'


const TEXT_FIELD_PROPS = [
  'value',
  'onBlur',
  'onChange',
  'onFocus',
  'name'
]

class TransactionDetails extends React.Component {
  constructor(props) {
    super(props)
    this.showDetailTransactions = this.showDetailTransactions.bind(this)
    this.normalize = this.normalize.bind(this)
  }

  showDetailTransactions(e, json){
    e.preventDefault()
    const rawTransaction = JSON.parse(json).rawTransaction
    this.props.decode(rawTransaction)
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

  render() {
    const fieldProps = pick(this.props.fieldProps, TEXT_FIELD_PROPS)
    const {touched, error} = this.props.fieldProps

    const lang = this.props.lang

    const item = this.props.transaction
    const btmAmountUnit = this.props.btmAmountUnit

    let view = <div></div>
    if (item.length !== 0) {
      const fee = normalizeGlobalBTMAmount(btmID, item.fee, btmAmountUnit)

      const inputs = this.normalize(item.inputs)
      const outputs =  this.normalize(item.outputs)

      const table = (inouts) =>
        (inouts.map((inout, index) =>
          <table key={index} className={styles.table}>
            <tr>
              <td className={styles.colLabel}> {lang === 'zh' ? '类型' : 'Type'}:</td>
              <td><code>{inout.type}</code></td>
            </tr>
            <tr>
              <td className={styles.colLabel}> {lang === 'zh' ? '地址' : 'Address'}:</td>
              <td><code>{inout.address}</code></td>
            </tr>
            <tr>
              <td className={styles.colLabel}> {lang === 'zh' ? '数量' : 'Amount'}:</td>
              <td><code>{inout.amount}</code></td>
            </tr>
            <tr>
              <td className={styles.colLabel}> {lang === 'zh' ? '资产' : 'Asset'}:</td>
              <td><code>{inout.assetAlias}</code></td>
            </tr>
            <tr>
              <td className={styles.colLabel}> {lang === 'zh' ? '合约程序' : 'Control Program'}:</td>
              <td><code>{inout.controlProgram}</code></td>
            </tr>
          </table>))

      view =  (<div  className={`form-group ${styles.view}`}>
        <FieldLabel>{lang === 'zh' ? '交易内容' : 'Transaction Content'}</FieldLabel>

        <div className={styles.main}>
          <div className={styles.txID}>
            <label>{lang === 'zh' ? '详情:' : 'Summary:'}</label>
            <table key={'txsummary'} className={styles.table}>
              <tr>
                <td  className={styles.colLabel}>
                  {lang === 'zh' ? '交易ID:' : 'Transaction ID:'}
                </td>
                <td>
                  <code>{item.txId}</code>
                </td>
              </tr>
              <tr>
                <td  className={styles.colLabel}>Gas:</td>
                <td><code>{fee}</code></td>
              </tr>
            </table>
          </div>

          <div>
            <label>{lang === 'zh' ? '输入:' : 'Input:'}</label>
            {table(inputs)}

            <label>{lang === 'zh' ? '输出:' : 'Output:'}</label>
            {table(outputs)}
          </div>
        </div>

      </div>)
    }



    return(
      <div className='form-group'>
        <FieldLabel>{lang === 'zh' ? '带签名交易' : 'To sign transaction'}</FieldLabel>
        <input className='form-control'
               type='text'
               placeholder={lang === 'zh' ? '在这里复制交易 HEX ...' : 'Paste transaction hex here...'}
               autoFocus={true}
               {...disableAutocomplete}
               {...fieldProps} />

        {touched && error && <span className='text-danger'><strong>{error}</strong></span>}
        {this.props.hint && <span className='help-block'>{this.props.hint}</span>}

        <div>
          <button className={`btn btn-default ${styles.btn}`}
                  onClick={(e) => this.showDetailTransactions(e, fieldProps.value)}>
            {lang === 'zh' ? '展示交易内容':'Transaction details'}
          </button>
        </div>
        {view}
      </div>
    )
  }
}

export default TransactionDetails
