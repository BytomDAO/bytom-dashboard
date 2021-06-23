import React from 'react'
import { ErrorBanner, HiddenField, Autocomplete, JsonField, TextField, ObjectSelectorField,AmountField } from 'features/shared/components'
import styles from './FormActionItem.scss'
import { btmID } from 'utility/environment'
import {withNamespaces} from 'react-i18next'

const CROSS_CHAIN_OUT_KEY = 'cross_chain_out'
const CROSS_CHAIN_IN_KEY = 'cross_chain_in'
const VOTE_OUTPUT_KEY = 'vote_output'
const VETO_KEY = 'veto'
const SPEND_ACCOUNT_KEY = 'spend_account'
const SPEND_UNSPENT_KEY = 'spend_account_unspent_output'
const CONTROL_RECEIVER_KEY = 'control_receiver'
const CONTROL_ADDRESS_KEY = 'control_address'
const RETIRE_ASSET_KEY = 'retire'
const TRANSACTION_REFERENCE_DATA = 'set_transaction_reference_data'

const actionLabels = {
  [CROSS_CHAIN_OUT_KEY]: 'Cross Chain Out',
  [CROSS_CHAIN_IN_KEY]: 'Cross Chain In',
  [VOTE_OUTPUT_KEY]: 'Vote Output',
  [VETO_KEY]: 'Veto',
  [SPEND_ACCOUNT_KEY]: 'Spend from account',
  [SPEND_UNSPENT_KEY]: 'Spend unspent output',
  [CONTROL_RECEIVER_KEY]: 'Control with receiver',
  [CONTROL_ADDRESS_KEY]: 'Control with address',
  [RETIRE_ASSET_KEY]: 'Retire',
  [TRANSACTION_REFERENCE_DATA]: 'Set transaction reference data',
}

const visibleFields = {
  [CROSS_CHAIN_OUT_KEY]: {asset: true, amount: true, address:true},
  [CROSS_CHAIN_IN_KEY]: {asset: true, amount: true, sourceId:true, sourcePos:true, vmVersion:true, issuanceProgram:true, rawDefinitionByte:true},
  [VOTE_OUTPUT_KEY]: {asset: true, amount: true, address:true, vote:true},
  [VETO_KEY]: {account:true, amount: true, asset: true, vote:true},
  [SPEND_ACCOUNT_KEY]: {asset: true, account: true, amount: true, password: true},
  [SPEND_UNSPENT_KEY]: {outputId: true, password: true},
  [CONTROL_RECEIVER_KEY]: {asset: true, receiver: true, amount: true},
  [CONTROL_ADDRESS_KEY]: {asset: true, address: true, amount: true},
  [RETIRE_ASSET_KEY]: {asset: true, amount: true},
  [TRANSACTION_REFERENCE_DATA]: {},
}

class ActionItem extends React.Component {
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
      vote,
      sourceId,
      sourcePos,
      vmVersion,
      rawDefinitionByte,
      issuanceProgram,
      referenceData } = this.props.fieldProps

    const visible = visibleFields[type.value] || {}
    const remove = (event) => {
      event.preventDefault()
      this.props.remove(this.props.index)
    }

    const t = this.props.t
    const btmAmounUnitVisible = (assetAlias.value === 'BTM' ||
      assetId.value === btmID )

    const decimal = this.props.decimal || 0

    const classNames = [styles.main]
    if (type.error) classNames.push(styles.error)

    return (
      <div className={classNames.join(' ')} ref={ref => this.scrollRef = ref}>
        <HiddenField fieldProps={type} />

        <div className={styles.header}>
          <label className={styles.title}>{actionLabels[type.value]}</label>
          <a href='#' className='btn btn-large btn-danger' onClick={remove}>{ t('commonWords.remove') }</a>
        </div>

        {type.error && <ErrorBanner message={type.error} />}

        {visible.account &&
          <ObjectSelectorField
            keyIndex='advtx-account'
            title={ t('form.account') }
            aliasField={Autocomplete.AccountAlias}
            fieldProps={{
              id: accountId,
              alias: accountAlias
            }}
            disabled
          />}

        {visible.receiver &&
          <JsonField title='Receiver' fieldProps={receiver} />}

        {visible.address && <TextField title={ t('form.address' )} fieldProps={address} />}
        {visible.vote && <TextField title={ t('form.vote' )} fieldProps={vote} />}
        {visible.sourceId && <TextField title={ t('form.sourceId' )} fieldProps={sourceId} />}
        {visible.sourcePos && <TextField title={ t('form.sourcePos' )} fieldProps={sourcePos} />}
        {visible.vmVersion && <TextField title={t('form.vmVersion')} fieldProps={vmVersion} />}
        {visible.issuanceProgram && <TextField title={ t('form.issuanceProgram') } fieldProps={issuanceProgram} />}
        {visible.rawDefinitionByte && <TextField title={ t('form.rawDefinitionByte') } fieldProps={rawDefinitionByte} />}


        {visible.outputId &&
          <TextField title='Output ID' fieldProps={outputId} />}

        {visible.asset &&
          <ObjectSelectorField
            keyIndex='advtx-asset'
            title={ t('form.asset')}
            aliasField={Autocomplete.AssetAlias}
            fieldProps={{
              id: assetId,
              alias: assetAlias
            }}
          />}

        {visible.amount &&
          <AmountField
            isBTM={btmAmounUnitVisible}
            title={t('form.amount')}
            fieldProps={amount}
            decimal={decimal}
          />}

        {visible.password && false &&
          <TextField title={t('key.password')} placeholder={t('key.password')} fieldProps={password} autoFocus={false} type={'password'} />
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

export default withNamespaces('translations') (ActionItem)
