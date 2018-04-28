import React from 'react'
import { ErrorBanner, HiddenField, Autocomplete, JsonField, TextField, ObjectSelectorField, AmountUnitField, AmountInputMask } from 'features/shared/components'
import styles from './FormActionItem.scss'

const ISSUE_KEY = 'issue'
const SPEND_ACCOUNT_KEY = 'spend_account'
const SPEND_UNSPENT_KEY = 'spend_account_unspent_output'
const CONTROL_RECEIVER_KEY = 'control_receiver'
const CONTROL_ADDRESS_KEY = 'control_address'
const RETIRE_ASSET_KEY = 'retire'
const TRANSACTION_REFERENCE_DATA = 'set_transaction_reference_data'

const actionLabels = {
  [ISSUE_KEY]: 'Issue',
  [SPEND_ACCOUNT_KEY]: 'Spend from account',
  [SPEND_UNSPENT_KEY]: 'Spend unspent output',
  [CONTROL_RECEIVER_KEY]: 'Control with receiver',
  [CONTROL_ADDRESS_KEY]: 'Control with address',
  [RETIRE_ASSET_KEY]: 'Retire',
  [TRANSACTION_REFERENCE_DATA]: 'Set transaction reference data',
}

const visibleFields = {
  [ISSUE_KEY]: {asset: true, amount: true, password: true},
  [SPEND_ACCOUNT_KEY]: {asset: true, account: true, amount: true, password: true},
  [SPEND_UNSPENT_KEY]: {outputId: true, password: true},
  [CONTROL_RECEIVER_KEY]: {asset: true, receiver: true, amount: true},
  [CONTROL_ADDRESS_KEY]: {asset: true, address: true, amount: true},
  [RETIRE_ASSET_KEY]: {asset: true, amount: true},
  [TRANSACTION_REFERENCE_DATA]: {},
}

export default class ActionItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      referenceDataOpen: props.fieldProps.type.value == TRANSACTION_REFERENCE_DATA
    }
    this.openReferenceData = this.openReferenceData.bind(this)
  }

  openReferenceData() {
    this.setState({referenceDataOpen: true})
  }

  componentDidMount() {
    window.scroll(
      window.scrollX,
      window.scrollY + this.scrollRef.getBoundingClientRect().top - 10
    )
  }

  render() {
    const {
      outputId,
      type,
      address,
      accountId,
      accountAlias,
      receiver,
      assetId,
      assetAlias,
      password,
      amount,
      referenceData } = this.props.fieldProps

    const visible = visibleFields[type.value] || {}
    const remove = (event) => {
      event.preventDefault()
      this.props.remove(this.props.index)
    }

    const lang = this.props.lang
    const btmAmounUnitVisible = (assetAlias.value === 'BTM' ||
      assetId.value === 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff' )

    const decimal = this.props.decimal

    const classNames = [styles.main]
    if (type.error) classNames.push(styles.error)

    return (
      <div className={classNames.join(' ')} ref={ref => this.scrollRef = ref}>
        <HiddenField fieldProps={type} />

        <div className={styles.header}>
          <label className={styles.title}>{actionLabels[type.value]}</label>
          <a href='#' className='btn btn-sm btn-danger' onClick={remove}>{ lang === 'zh' ? '删除' : 'Remove' }</a>
        </div>

        {type.error && <ErrorBanner message={type.error} />}

        {visible.account &&
          <ObjectSelectorField
            lang={lang}
            title={ lang === 'zh' ? '账户' : 'Account' }
            aliasField={Autocomplete.AccountAlias}
            fieldProps={{
              id: accountId,
              alias: accountAlias
            }}
          />}

        {visible.receiver &&
          <JsonField title='Receiver' fieldProps={receiver} />}

        {visible.address && <TextField title={ lang === 'zh' ? '地址' :'Address'} fieldProps={address} />}

        {visible.outputId &&
          <TextField title='Output ID' fieldProps={outputId} />}

        {visible.asset &&
          <ObjectSelectorField
            title={ lang === 'zh' ? '资产' :'Asset'}
            lang={lang}
            aliasField={Autocomplete.AssetAlias}
            fieldProps={{
              id: assetId,
              alias: assetAlias
            }}
          />}

        {visible.amount && !btmAmounUnitVisible && !decimal &&
          <TextField title={ lang === 'zh' ? '数量' :'Amount' } fieldProps={amount} />}

        {visible.amount && !btmAmounUnitVisible && decimal &&
          <AmountInputMask title={ lang === 'zh' ? '数量' :'Amount' } fieldProps={amount} decimal={decimal} />}

        {visible.amount && btmAmounUnitVisible &&
          <AmountUnitField title={ lang === 'zh' ? '数量' :'Amount' } fieldProps={amount} />}

        {visible.password && false &&
          <TextField title={lang === 'zh' ? '密码' :'Password'} placeholder={lang === 'zh' ? '密码' :'Password'} fieldProps={password} autoFocus={false} type={'password'} />
        }

        {false && this.state.referenceDataOpen &&
          <JsonField title='Reference data' fieldProps={referenceData} />
        }
        {false && !this.state.referenceDataOpen &&
          <button type='button' className='btn btn-link' onClick={this.openReferenceData}>
            Add reference data
          </button>
        }
      </div>
    )
  }
}
