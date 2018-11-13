import React from 'react'
import pick from 'lodash/pick'
import { FieldLabel } from 'features/shared/components'
import disableAutocomplete from 'utility/disableAutocomplete'
import styles from './TransactionDetails.scss'
import { Connection } from 'sdk'
import Modal from './Modal'
import {withNamespaces} from 'react-i18next'

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
    const rawTransaction = Connection.camelize(JSON.parse(json)).rawTransaction
    this.props.decode(rawTransaction).then(() => {
      this.props.showJsonModal(
        <Modal
          transaction={this.props.transaction}
          btmAmountUnit={this.props.btmAmountUnit}
          asset={this.props.asset}
        />
      )
    })
  }

  render() {
    const fieldProps = pick(this.props.fieldProps, TEXT_FIELD_PROPS)
    const {touched, error} = this.props.fieldProps

    const t = this.props.t

    return(
      <div className='form-group'>
        <FieldLabel>{t('transaction.advance.toSignTransaction')}</FieldLabel>
        <input className='form-control'
               type='text'
               placeholder={t('transaction.advance.signPlaceholder')}
               autoFocus={true}
               {...disableAutocomplete}
               {...fieldProps} />

        {touched && error && <span className='text-danger'><strong>{error}</strong></span>}
        {this.props.hint && <span className='help-block'>{this.props.hint}</span>}
          <a className={`btn btn-link ${styles.btn}`}
                  onClick={(e) => this.showDetailTransactions(e, fieldProps.value)}>
            {t('transaction.advance.showDetails')}
          </a>
      </div>
    )
  }
}

export default withNamespaces('translations') (TransactionDetails)
