import React from 'react'
import pick from 'lodash/pick'
import { FieldLabel } from 'features/shared/components'
import disableAutocomplete from 'utility/disableAutocomplete'
import { btmID } from 'utility/environment'
import { normalizeGlobalBTMAmount } from 'utility/buildInOutDisplay'
import { Summary } from '../../'
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
  }

  showDetailTransactions(e, json){
    e.preventDefault()
    const rawTransaction = JSON.parse(json).raw_transaction
    this.props.decode(rawTransaction)
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

      const inputs = item.inputs
      const outputs = item.outputs

      view =  (<div  className='form-group'>
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
            {inputs.map((input, index) =>
              <table key={index} className={styles.table}>
                <tr>
                  <td className={styles.colLabel}>Type:</td>
                  <td><code>{input.type}</code></td>
                </tr>
                <tr>
                  <td className={styles.colLabel}>Address:</td>
                  <td><code>{input.address}</code></td>
                </tr>
                <tr>
                  <td className={styles.colLabel}>Amount:</td>
                  <td><code>{input.amount}</code></td>
                </tr>
                <tr>
                  <td className={styles.colLabel}>Asset:</td>
                  <td><code>{input.assetId}</code></td>
                </tr>
                <tr>
                  <td className={styles.colLabel}>Control Program:</td>
                  <td><code>{input.controlProgram}</code></td>
                </tr>
              </table>
            )}

            <label>{lang === 'zh' ? '输出:' : 'Output:'}</label>
            {outputs.map((output, index) =>
              <table key={index}  className={styles.table}>
                <tr>
                  <td className={styles.colLabel}>Type:</td>
                  <td><code>{output.type}</code></td>
                </tr>
                <tr>
                  <td className={styles.colLabel}>Address:</td>
                  <td><code>{output.address}</code></td>
                </tr>
                <tr>
                  <td className={styles.colLabel}>Amount:</td>
                  <td><code>{output.amount}</code></td>
                </tr>
                <tr>
                  <td className={styles.colLabel}>Asset:</td>
                  <td><code>{output.assetId}</code></td>
                </tr>
                <tr>
                  <td className={styles.colLabel}>Control Program:</td>
                  <td><code>{output.controlProgram}</code></td>
                </tr>
              </table>
            )}
          </div>

          {/*<div>*/}
            {/*<div>*/}
              {/*<label>Gas</label>*/}
              {/*<div>*/}
                {/*<code>{fee}</code>*/}
              {/*</div>*/}
            {/*</div>*/}
          {/*</div>*/}
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
            展示交易内容
          </button>
        </div>
        {view}
      </div>
    )
  }
}

export default TransactionDetails
