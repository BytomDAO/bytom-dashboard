import {
  BaseNew,
  TextField,
  Autocomplete,
  ObjectSelectorField,
  AmountField,
  GasField,
} from 'features/shared/components'
import {chainClient} from 'utility/environment'
import {reduxForm} from 'redux-form'
import React from 'react'
import styles from '../New.scss'
import  TxContainer  from '../NewTransactionsContainer/TxContainer'
import actions from 'actions'
import { btmID } from 'utility/environment'
import CrossChainConfirmModal from './CrossChainConfirmModal/CrossChainConfirmModal'
import {balance, getAssetDecimal} from '../../../transactions'
import {withNamespaces} from 'react-i18next'

class CrossChainTransaction extends React.Component {
  constructor(props) {
    super(props)
    this.connection = chainClient().connection
    this.state = {
      estimateGas:1000000,
      displayGas: true
    }

    this.submitWithValidation = this.submitWithValidation.bind(this)
    this.disableSubmit = this.disableSubmit.bind(this)
  }

  disableSubmit() {
    const {
      values: {assetAlias, assetId, amount, address}
    } = this.props

    const noAsset = !assetAlias && !assetId

    return ( noAsset || !address || !amount )
  }

  submitWithValidation(data) {
    return new Promise((resolve, reject) => {
      this.props.submitForm(Object.assign({}, data, {state: this.state, form: 'crossChainTx'}))
        .then(() => {
          this.props.closeModal()
          this.props.destroyForm()
        })
        .catch((err) => {
          if(err.message !== 'PasswordWrong'){
            this.props.closeModal()
          }
          reject({_error: err})
        })
    })
  }

  confirmedTransaction(e, assetDecimal){
    e.preventDefault()
    this.props.showModal(
      <CrossChainConfirmModal
        cancel={this.props.closeModal}
        onSubmit={this.submitWithValidation}
        gas={this.state.estimateGas}
        btmAmountUnit={this.props.btmAmountUnit}
        assetDecimal={assetDecimal}
        asset={this.props.asset}
      />
    )
  }

  render() {
    const {
      fields: {accountId, accountAlias,assetAlias, assetId, amount, address, gasLevel, isChainTx},
      error,
      submitting
    } = this.props
    const t = this.props.t;

    let submitLabel = t('transaction.crossChain.submit')

    const assetDecimal = getAssetDecimal(this.props.fields, this.props.asset) || 0

    const showAvailableBalance = (accountAlias.value || accountId.value) &&
      (assetAlias.value || assetId.value)

    const availableBalance = balance(this.props.fields, assetDecimal, this.props.balances, this.props.btmAmountUnit)

    const showBtmAmountUnit = (assetAlias.value === 'BTM' || assetId.value === btmID)

    const net = this.props.networkId

    return <TxContainer
      error={error}
      onSubmit={(e) => this.confirmedTransaction(e)}
      submitting={submitting}
      submitLabel={submitLabel}
      disabled={this.disableSubmit()}
      className={styles.container}
    >
      <div className={styles.borderBottom}>
        <label className={styles.title}>{t('transaction.crossChain.title')}</label>
        <div className={`${styles.mainBox} `}>
          <ObjectSelectorField
            key='account-selector-field'
            keyIndex='votetx-account'
            title={t('form.account')}
            aliasField={Autocomplete.AccountAlias}
            fieldProps={{
              id: accountId,
              alias: accountAlias
            }}
            disabled
          />

          <ObjectSelectorField
            key='asset-selector-field'
            keyIndex='normaltx-asset'
            title={t('form.asset')}
            aliasField={Autocomplete.AssetAlias}
            fieldProps={{
              id: assetId,
              alias: assetAlias
            }}
          />
          {showAvailableBalance && availableBalance &&
          <small className={styles.balanceHint}>{t('transaction.normal.availableBalance')} {availableBalance}</small>}

          <AmountField
            isBTM={showBtmAmountUnit}
            title={t('form.amount')}
            fieldProps={amount}
            decimal={assetDecimal}
          />

          <TextField title={t('transaction.crossChain.address')} fieldProps={address} hint={t('transaction.crossChain.addressHint', {id: net})}/>
        </div>

        {showBtmAmountUnit && [<label className={styles.title}>{t('transaction.new.submitType')}</label>,
          <div className={styles.submitSwitchSet}>
            <div className={styles.submitSwitch}>
              <div className={styles.label}>{t('transaction.new.chainTx')}</div>
              <label className={styles.switch}>
                <input
                  type='checkbox'
                  {...isChainTx}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            <div>{t('transaction.new.chainTxNote')}</div>
          </div>]}

        {this.state.displayGas && [<label className={styles.title}>{t('transaction.normal.selectFee')}</label>,
          <div className={styles.txFeeBox}>
            <GasField
              gas={this.state.estimateGas}
              fieldProps={gasLevel}
              btmAmountUnit={this.props.btmAmountUnit}
            />
            <span className={styles.feeDescription}></span>
          </div>]}
      </div>
    </TxContainer>
  }
}

const validate = (values, props) => {
  const errors = {gas: {}}
  const t = props.t

  // Numerical
  if (values.amount && !/^\d+(\.\d+)?$/i.test(values.amount)) {
    errors.amount = ( t('errorMessage.amountError') )
  }
  return errors
}

const mapDispatchToProps = (dispatch) => ({
  showError: err => dispatch({type: 'ERROR', payload: err}),
  closeModal: () => dispatch(actions.app.hideModal),
  showModal: (body) => dispatch(actions.app.showModal(
    body,
    actions.app.hideModal,
    null,
    {
      dialog: true,
      noCloseBtn: true
    }
  )),
  ...BaseNew.mapDispatchToProps('transaction')(dispatch)
})

const initialValues = (state, ownProps) => {
  const account = state.account.currentAccount
  if (account) {
    return {
      initialValues: {
        accountAlias: account,
        accountId:'',
        gasLevel: '1',
      }
    }
  }
  return {}
}

const mapStateToProps = (state, ownProps) => {
  const coreData = state.core.coreData
  let networkId
  if(coreData && coreData.networkId){
    switch (coreData.networkId){
      case 'mainnet':
        networkId = 'bm'
        break
      case 'testnet':
        networkId = 'tm'
        break
      case 'solonet':
        networkId = 'sm'
    }
  }
  return {
    ...BaseNew.mapStateToProps('transaction')(state, ownProps),
    networkId
  }
}


export default withNamespaces('translations') (BaseNew.connect(
  mapStateToProps,
  mapDispatchToProps,
  reduxForm({
    form: 'CrossChainTransaction',
    fields: [
      'accountAlias',
      'accountId',
      'assetAlias',
      'assetId',
      'amount',
      'address',
      'gasLevel',
      'isChainTx'
    ],
    validate,
    touchOnChange: true
  }, initialValues)(CrossChainTransaction)
))
