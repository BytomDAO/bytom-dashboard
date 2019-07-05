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
import {balance, getAssetDecimal, crossChainTxActionBuilder} from '../../../transactions'
import {withNamespaces} from 'react-i18next'

class CrossChainTransaction extends React.Component {
  constructor(props) {
    super(props)
    this.connection = chainClient().connection
    this.state = {
      estimateGas:null
    }

    this.submitWithValidation = this.submitWithValidation.bind(this)
    this.disableSubmit = this.disableSubmit.bind(this)
  }

  disableSubmit() {
    return !(this.state.estimateGas)
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

  estimateNormalTransactionGas() {
    const transaction = this.props.fields

    const accountAlias = transaction.accountAlias.value
    const accountId = transaction.accountId.value
    const assetAlias = transaction.assetAlias.value
    const assetId = transaction.assetId.value
    const address = transaction.address.value
    const amount = Number(transaction.amount.value)

    const {t, i18n} = this.props

    const noAccount = !accountAlias && !accountId
    const noAsset = !assetAlias && !assetId

    if ( address === '' || amount === 0|| noAccount || noAsset) {
      this.setState({estimateGas: null})
      return
    }

    const actions = crossChainTxActionBuilder(transaction, Math.pow(10, 7))

    this.props.buildTransaction({actions, ttl: 1}).then(tmp => {
      return this.props.estimateGasFee(tmp.data).then(resp => {
        this.setState({estimateGas: Math.ceil(resp.data.totalNeu/100000)*100000})
      }).catch(err =>{
        throw err
      })

    }).catch(err =>{
      this.setState({estimateGas: null, address: null})
      const errorMsg =  err.code && i18n.exists(`btmError.${err.code}`) && t(`btmError.${err.code}`) || err.msg
      this.props.showError(new Error(errorMsg))
    })

  }

  render() {
    const {
      fields: {accountId, accountAlias,assetAlias, assetId, amount, address, gasLevel},
      error,
      submitting
    } = this.props
    const t = this.props.t;
    [accountAlias, accountId, assetAlias, assetId, amount, address].forEach(key => {
      key.onBlur = this.estimateNormalTransactionGas.bind(this)
    });

    let submitLabel = t('transaction.crossChain.submit')

    const assetDecimal = getAssetDecimal(this.props.fields, this.props.asset) || 0

    const showAvailableBalance = (accountAlias.value || accountId.value) &&
      (assetAlias.value || assetId.value)

    const availableBalance = balance(this.props.fields, assetDecimal, this.props.balances, this.props.btmAmountUnit)

    const showBtmAmountUnit = (assetAlias.value === 'BTM' || assetId.value === btmID)

    return (
          <TxContainer
            error={error}
            onSubmit={(e)=>this.confirmedTransaction(e)}
            submitting={submitting}
            submitLabel= {submitLabel}
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
              />

              <ObjectSelectorField
                key='asset-selector-field'
                keyIndex='normaltx-asset'
                title={ t('form.asset')}
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

              <TextField title={t('transaction.crossChain.address')} fieldProps={address}/>
            </div>


            <label className={styles.title}>{t('transaction.normal.selectFee')}</label>
            <div className={styles.txFeeBox}>
              <GasField
                gas={this.state.estimateGas}
                fieldProps={gasLevel}
                btmAmountUnit={this.props.btmAmountUnit}
              />
              <span className={styles.feeDescription}> {t('transaction.normal.feeDescription')}</span>
            </div>
          </div>
        </TxContainer>
    )
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
  estimateGasFee: actions.transaction.estimateGas,
  buildTransaction: actions.transaction.buildTransaction,
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

export default withNamespaces('translations') (BaseNew.connect(
  BaseNew.mapStateToProps('transaction'),
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
    ],
    validate,
    touchOnChange: true
  }, initialValues)(CrossChainTransaction)
))
