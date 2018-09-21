import {
  BaseNew,
  FormSection,
  TextField,
  Autocomplete,
  ObjectSelectorField,
  AmountUnitField,
  AmountInputMask,
  ErrorBanner,
  SubmitIndicator,
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


class NormalTxForm extends React.Component {
  constructor(props) {
    super(props)
    this.connection = chainClient().connection
    this.state = {
      estimateGas:null
    }

    this.submitWithValidation = this.submitWithValidation.bind(this)
    this.disableSubmit = this.disableSubmit.bind(this)
  }

  disableSubmit(props) {
    const hasValue = target => {
      return !!(target && target.value)
    }

    return !( (this.state.estimateGas) &&
      (hasValue(props.accountId) || hasValue(props.accountAlias)) &&
      (hasValue(props.assetId) || hasValue(props.assetAlias)) &&
      hasValue(props.address) && (hasValue(props.amount))
    )
  }

  submitWithValidation(data) {
    return new Promise((resolve, reject) => {
      this.props.submitForm(Object.assign({}, data, {state: this.state, form: 'normalTx'}))
        .then(
          this.props.closeModal()
        )
        .catch((err) => {
          const response = {}

          response['_error'] = err
          return reject(response)
        })
    })
  }

  confirmedTransaction(e){
    e.preventDefault()
    this.props.showModal(
      <ConfirmModal
        onSubmit={this.submitWithValidation}
        gas={this.state.estimateGas}
      />
    )
  }

  estimateNormalTransactionGas() {
    const transaction = this.props.fields
    const address = transaction.address.value
    const amount = transaction.amount.value
    const accountAlias = transaction.accountAlias.value
    const accountId = transaction.accountId.value
    const assetAlias = transaction.assetAlias.value
    const assetId = transaction.assetId.value

    const noAccount = !accountAlias && !accountId
    const noAsset = !assetAlias && !assetId

    if (!address || !amount || noAccount || noAsset) {
      this.setState({estimateGas: null})
      return
    }

    const spendAction = {
      accountAlias,
      accountId,
      assetAlias,
      assetId,
      amount: Number(amount),
      type: 'spend_account'
    }
    const receiveAction = {
      address,
      assetAlias,
      assetId,
      amount: Number(amount),
      type: 'control_address'
    }

    const gasAction = {
      accountAlias,
      accountId,
      assetAlias: 'BTM',
      amount: Math.pow(10, 7),
      type: 'spend_account'
    }

    const actions = [spendAction, receiveAction, gasAction]
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
      fields: {accountId, accountAlias, assetId, assetAlias, address, amount, gasLevel},
      error,
      submitting
    } = this.props
    const lang = this.props.lang;
    [amount, accountAlias, accountId, assetAlias, assetId].forEach(key => {
      key.onBlur = this.estimateNormalTransactionGas.bind(this)
    })

    let submitLabel = lang === 'zh' ? '提交交易' : 'Submit transaction'

    const assetDecimal = this.props.assetDecimal(this.props.fields) || 0

    const showAvailableBalance = (accountAlias.value || accountId.value) &&
      (assetAlias.value || assetId.value)

    const availableBalance = this.props.balanceAmount(this.props.fields, assetDecimal)

    const showBtmAmountUnit = (assetAlias.value === 'BTM' || assetId.value === btmID)

    return (
        <form
          className={styles.container}
          onSubmit={e => this.confirmedTransaction(e)}
          {...disableAutocomplete}
          // onKeyDown={(e) => { this.props.handleKeyDown(e, handleSubmit(this.submitWithValidation), this.disableSubmit(this.props.fields)) }}
        >
          <div>
            <label className={styles.title}>{lang === 'zh' ? '从' : 'From'}</label>
            <div className={styles.main}>
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
            <div className={styles.main}>
              <TextField title={lang === 'zh' ? '地址' : 'Address'} fieldProps={{
                ...address,
                onBlur: (e) => {
                  address.onBlur(e)
                  this.estimateNormalTransactionGas()
                },
              }}/>
              {!showBtmAmountUnit &&
              <AmountInputMask title={lang === 'zh' ? '数量' : 'Amount'} fieldProps={amount} decimal={assetDecimal}
              />}
              {showBtmAmountUnit &&
              <AmountUnitField title={lang === 'zh' ? '数量' : 'Amount'} fieldProps={amount}/>
              }
            </div>

            <label className={styles.title}>{lang === 'zh' ? '选择手续费' : 'Select Fee'}</label>
            <GasField
              gas={this.state.estimateGas}
              fieldProps={gasLevel}
              btmAmountUnit={this.props.btmAmountUnit}
            />
          </div>

          <FormSection className={styles.submitSection}>
            {error &&
            <ErrorBanner
              title='Error submitting form'
              error={error} />}

            <div className={styles.submit}>
              <button type='submit' className='btn btn-primary'
                      disabled={submitting || this.disableSubmit(this.props.fields)}
              >
                {submitLabel}
              </button>

              {submitting &&
              <SubmitIndicator />
              }
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
  return new Promise((resolve, reject) => {
    const address = values.address
    chainClient().accounts.validateAddresses(address)
      .then(
        (resp) => {
          if(!resp.data.valid){
            reject({ address: 'invalid address'})
          }else {
            resolve()
          }
        }
      ).catch((err) => {
        reject({ address: err })
      })
  })
}


export default BaseNew.connect(
  BaseNew.mapStateToProps('transaction'),
  (dispatch) => ({
    showError: err => dispatch({type: 'ERROR', payload: err}),
    closeModal: () => dispatch(actions.app.hideModal),
    showModal: (body) => dispatch(actions.app.showModal(
      body,
      actions.app.hideModal,
      null,
      {
        // dialog: true,
        noCloseBtn: true
      }
    )),
    ...BaseNew.mapDispatchToProps('transaction')(dispatch)
  }),
  reduxForm({
    form: 'NormalTransactionForm',
    fields: [
      'accountAlias',
      'accountId',
      'amount',
      'assetAlias',
      'assetId',
      'gasLevel',
      'address',
    ],
    asyncValidate,
    asyncBlurFields: [ 'address'],
    validate,
    destroyOnUnmount: false,
    touchOnChange: true,
    initialValues: {
      gasLevel: '1'
    },
  })(NormalTxForm)
)


