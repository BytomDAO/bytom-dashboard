import React from 'react'
import pick from 'lodash/pick'
import { FieldLabel } from 'features/shared/components'
import disableAutocomplete from 'utility/disableAutocomplete'
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
    const rawTransaction = JSON.parse(json).rawTransaction
    this.props.decode(rawTransaction).then(() => {
      this.props.showJsonModal(<pre>{JSON.stringify(this.props.transaction, null, 2)}</pre>)
    })
  }

  render() {
    const fieldProps = pick(this.props.fieldProps, TEXT_FIELD_PROPS)
    const {touched, error} = this.props.fieldProps

    const lang = this.props.lang

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
          <button className={`btn btn-link ${styles.btn}`}
                  onClick={(e) => this.showDetailTransactions(e, fieldProps.value)}>
            {lang === 'zh' ? '展示交易内容':'Show transaction details'}
          </button>
      </div>
    )
  }
}

export default TransactionDetails
