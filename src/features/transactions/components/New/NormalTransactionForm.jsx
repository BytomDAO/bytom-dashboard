import {
  BaseNew,
  FormSection,
  TextField,
  Autocomplete,
  ObjectSelectorField,
  AmountUnitField,
  AmountInputMask,
  ErrorBanner,
  GasField
} from 'features/shared/components'
import {chainClient} from 'utility/environment'
import {reduxForm} from 'redux-form'
import React from 'react'
import styles from './New.scss'
import disableAutocomplete from 'utility/disableAutocomplete'
import { btmID } from 'utility/environment'
import actions from 'actions'
import ConfirmModal from './ConfirmModal/ConfirmModal'
import { balance , getAssetDecimal, normalTxActionBuilder} from '../../transactions'

class NormalTxForm extends React.Component {
  constructor(props) {
    super(props)
    this.connection = chainClient().connection
    this.state = {
      estimateGas:null,
      counter: 1
    }

    this.submitWithValidation = this.submitWithValidation.bind(this)
    this.disableSubmit = this.disableSubmit.bind(this)
    this.addReceiverItem = this.addReceiverItem.bind(this)
  }

  disableSubmit() {
    return !(this.state.estimateGas)
  }

  submitWithValidation(data) {
    return new Promise((resolve, reject) => {
      this.props.submitForm(Object.assign({}, data, {state: this.state, form: 'normalTx'}))
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
      <ConfirmModal
        cancel={this.props.closeModal}
        onSubmit={this.submitWithValidation}
        gas={this.state.estimateGas}
        btmAmountUnit={this.props.btmAmountUnit}
        assetDecimal={assetDecimal}
        asset={this.props.asset}
        lang = {this.props.lang}
      />
    )
  }

  addReceiverItem() {
    const counter = this.state.counter
    this.props.fields.receivers.addField({
      id: counter
    })
    this.setState({
      counter: counter+1,
      estimateGas: null
    })
  }

  removeReceiverItem(index) {
    const receiver = this.props.fields.receivers
    const promise = new Promise(function(resolve, reject) {
      try {
        receiver.removeField(index)
      } catch (err) {
        reject(err)
      }
      resolve()
    })

    promise.then(() =>  this.estimateNormalTransactionGas())
  }

  estimateNormalTransactionGas() {
    const transaction = this.props.fields
    const accountAlias = transaction.accountAlias.value
    const accountId = transaction.accountId.value
    const assetAlias = transaction.assetAlias.value
    const assetId = transaction.assetId.value
    const receivers = transaction.receivers
    const addresses = receivers.map(x => x.address.value)
    const amounts = receivers.map(x => Number(x.amount.value))

    const noAccount = !accountAlias && !accountId
    const noAsset = !assetAlias && !assetId

    if ( addresses.includes('') || amounts.includes(0)|| noAccount || noAsset) {
      this.setState({estimateGas: null})
      return
    }

    const actions = normalTxActionBuilder(transaction, Math.pow(10, 7), 'amount.value' )

    const body = {actions, ttl: 1}
    this.connection.request('/build-transaction', body).then(resp => {
      if (resp.status === 'fail') {
        this.setState({estimateGas: null})
        this.props.showError(new Error(resp.msg))
        return
      }

      return this.connection.request('/estimate-transaction-gas', {
        transactionTemplate: resp.data
      }).then(resp => {
        if (resp.status === 'fail') {
          this.setState({estimateGas: null})
          this.props.showError(new Error(resp.msg))
          return
        }
        this.setState({estimateGas: Math.ceil(resp.data.totalNeu/100000)*100000})
      })
    })
  }

  render() {
    const {
      fields: {accountId, accountAlias, assetId, assetAlias, receivers, gasLevel},
      error,
      submitting
    } = this.props
    const lang = this.props.lang;
    [accountAlias, accountId, assetAlias, assetId].forEach(key => {
      key.onBlur = this.estimateNormalTransactionGas.bind(this)
    });
    (receivers.map(receiver => receiver.amount)).forEach(amount =>{
      amount.onBlur = this.estimateNormalTransactionGas.bind(this)
    })

    let submitLabel = lang === 'zh' ? '提交交易' : 'Submit transaction'

    const assetDecimal = getAssetDecimal(this.props.fields, this.props.asset) || 0

    const showAvailableBalance = (accountAlias.value || accountId.value) &&
      (assetAlias.value || assetId.value)

    const availableBalance = balance(this.props.fields, assetDecimal, this.props.balances, this.props.btmAmountUnit)

    const showBtmAmountUnit = (assetAlias.value === 'BTM' || assetId.value === btmID)

    return (
        <form
          className={styles.container}
          onSubmit={e => this.confirmedTransaction(e, assetDecimal)}
          {...disableAutocomplete}
        >
          <div className={styles.borderBottom}>
            <label className={styles.title}>{lang === 'zh' ? '从' : 'From'}</label>
            <div className={`${styles.mainBox} ${this.props.tutorialVisible? styles.tutorialItem: styles.item}`}>
              <ObjectSelectorField
                key='account-selector-field'
                keyIndex='normaltx-account'
                lang={lang}
                title={lang === 'zh' ? '账户' : 'Account'}
                aliasField={Autocomplete.AccountAlias}
                fieldProps={{
                  id: accountId,
                  alias: accountAlias
                }}
              />
              <div>
                <ObjectSelectorField
                  key='asset-selector-field'
                  keyIndex='normaltx-asset'
                  lang={lang}
                  title={lang === 'zh' ? '资产' : 'Asset'}
                  aliasField={Autocomplete.AssetAlias}
                  fieldProps={{
                    id: assetId,
                    alias: assetAlias
                  }}
                />
                {showAvailableBalance && availableBalance &&
                <small className={styles.balanceHint}>{lang === 'zh' ? '可用余额:' : 'Available balance:'} {availableBalance}</small>}
              </div>
            </div>

            <label className={styles.title}>{lang === 'zh' ? '至' : 'To'}</label>

            <div className={styles.mainBox}>
            {receivers.map((receiver, index) =>
              <div
                className={this.props.tutorialVisible? styles.tutorialItem: styles.item}
                key={receiver.id.value}>
                <TextField title={lang === 'zh' ? '地址' : 'Address'} fieldProps={{
                  ...receiver.address,
                  onBlur: (e) => {
                    receiver.address.onBlur(e)
                    this.estimateNormalTransactionGas()
                  },
                }}/>

                {!showBtmAmountUnit &&
                <AmountInputMask title={lang === 'zh' ? '数量' : 'Amount'} fieldProps={receiver.amount} decimal={assetDecimal}
                />}
                {showBtmAmountUnit &&
                <AmountUnitField title={lang === 'zh' ? '数量' : 'Amount'} fieldProps={receiver.amount}/>
                }

                {index===0 ?
                  <a href='#' className={styles.receiverBtn} onClick={this.addReceiverItem}>+</a> :
                  <a href='#' className={`${styles.receiverBtn} text-danger`} onClick={()=> this.removeReceiverItem(index)}>-</a>
                }

              </div>
            )}
            </div>

            <label className={styles.title}>{lang === 'zh' ? '选择手续费' : 'Select Fee'}</label>
            <div className={styles.txFeeBox}>
              <GasField
                gas={this.state.estimateGas}
                fieldProps={gasLevel}
                btmAmountUnit={this.props.btmAmountUnit}
              />
              <span className={styles.feeDescription}> {lang ==='zh'?
                '交易所需手续费， 你的交易将会在2.5分钟之后完成。':
                'This is the money that might be used to process this transaction. Your transaction will be mined usually within 2.5 minutes.'}</span>
            </div>
          </div>

          <FormSection className={styles.submitSection}>
            {error && error.message !== 'PasswordWrong' &&
            <ErrorBanner
              title='Error submitting form'
              error={error} />}

            <div className={styles.submit}>
              <button type='submit' className='btn btn-primary'
                      disabled={submitting || this.disableSubmit()}>
                {submitLabel}
              </button>
            </div>
          </FormSection>
        </form>
    )
  }
}

const validate = (values, props) => {
  const errors = {gas: {}}
  const lang = props.lang

  // Numerical
  if (values.amount && !/^\d+(\.\d+)?$/i.test(values.amount)) {
    errors.amount = ( lang === 'zh' ? '请输入数字' : 'Invalid amount type' )
  }
  return errors
}

const asyncValidate = (values) => {
  const errors = []
  const promises = []

  values.receivers.forEach((receiver, idx) => {
    const address = values.receivers[idx].address
    if ( !address || address.length === 0)
      promises.push(Promise.resolve())
    else{
      promises.push(
        chainClient().accounts.validateAddresses(address)
          .then(
            (resp) => {
              if (!resp.data.valid) {
                errors[idx] = {address: 'invalid address'}
              }
              return {}
            }
          ))
    }
  })

  return Promise.all(promises).then(() => {
    if (errors.length > 0) throw {
      receivers: errors
    }
    return {}
  })
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

export default BaseNew.connect(
  BaseNew.mapStateToProps('transaction'),
  mapDispatchToProps,
  reduxForm({
    form: 'NormalTransactionForm',
    fields: [
      'accountAlias',
      'accountId',
      'assetAlias',
      'assetId',
      'receivers[].id',
      'receivers[].amount',
      'receivers[].address',
      'gasLevel',
    ],
    asyncValidate,
    asyncBlurFields: ['receivers[].address'],
    validate,
    touchOnChange: true,
    initialValues: {
      gasLevel: '1',
      receivers:[{
        id: 0,
        amount:'',
        address:''
      }]
    },
  })(NormalTxForm)
)


