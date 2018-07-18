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
  PasswordField
} from 'features/shared/components'
import {chainClient} from 'utility/environment'
import {reduxForm} from 'redux-form'
import React from 'react'
import styles from './New.scss'
import disableAutocomplete from 'utility/disableAutocomplete'
import { normalizeBTMAmountUnit } from 'utility/buildInOutDisplay'
import { btmID } from 'utility/environment'

const rangeOptions = [
  {
    label: 'Standard',
    label_zh: '标准',
    ratio: 1
  },
  {
    label: 'Fast',
    label_zh: '快速',
    ratio: 2
  },
  {
    label: 'Customize',
    label_zh: '自定义',
    value: ''
  }
]

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

  componentDidMount() {
    this.props.fields.gas.type.onChange(rangeOptions[0].label)
    this.props.fields.gas.price.onChange(rangeOptions[0].value)
  }

  disableSubmit(props) {
    const hasValue = target => {
      return !!(target && target.value)
    }

    return !( (this.state.estimateGas || hasValue(props.gas.price))&&
      (hasValue(props.accountId) || hasValue(props.accountAlias)) &&
      (hasValue(props.assetId) || hasValue(props.assetAlias)) &&
      hasValue(props.address) && (hasValue(props.amount)) &&
      hasValue(props.password)
    )
  }

  submitWithValidation(data) {
    return new Promise((resolve, reject) => {
      this.props.submitForm(Object.assign({}, data, {state: this.state, form: 'normalTx'}))
        .catch((err) => {
          const response = {}

          if (err.data) {
            response.actions = []

            err.data.forEach((error) => {
              response.actions[error.data.actionIndex] = {type: error}
            })
          }

          response['_error'] = err
          return reject(response)
        })
    })
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
      fields: {accountId, accountAlias, assetId, assetAlias, address, amount, gas, password},
      error,
      handleSubmit,
      submitting
    } = this.props
    const lang = this.props.lang;
    [amount, accountAlias, accountId, assetAlias, assetId].forEach(key => {
      key.onBlur = this.estimateNormalTransactionGas.bind(this)
    })

    let submitLabel = lang === 'zh' ? '提交交易' : 'Submit transaction'

    const gasOnChange = event => {
      gas.type.onChange(event)

      const range = rangeOptions.find(item => item.label === event.target.value)
      gas.price.onChange(range.value)
    }
    const assetDecimal = this.props.assetDecimal(this.props.fields) || 0

    const showAvailableBalance = (accountAlias.value || accountId.value) &&
      (assetAlias.value || assetId.value)

    const availableBalance = this.props.balanceAmount(this.props.fields, assetDecimal)

    const showBtmAmountUnit = (assetAlias.value === 'BTM' || assetId.value === btmID)

    return (
        <form
          onSubmit={handleSubmit(this.submitWithValidation)} {...disableAutocomplete}
          onKeyDown={(e) => { this.props.handleKeyDown(e, handleSubmit(this.submitWithValidation), this.disableSubmit(this.props.fields)) }}>
          <FormSection title={lang === 'zh' ? '简单交易' : 'Normal Trasaction'}>
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
              <small className={styles.balanceHint}>{availableBalance} {lang === 'zh' ? '可用' : 'available'} </small>}
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

            <label className={styles.title}>Gas</label>
            <table>
              <tbody className={styles.optionsBtnContianer}>
                {rangeOptions.map((option) =>
                  <tr className={styles.optionsBtn}>
                    <td className={styles.optionsLabel}>
                      <label>
                        <input type='radio'
                               {...gas.type}
                               onChange={gasOnChange}
                               value={option.label}
                               checked={option.label == gas.type.value}
                        />
                        {lang === 'zh' ? option.label_zh : option.label}
                      </label>
                    </td>
                    <td>
                      {
                        option.label == gas.type.value && option.label !== 'Customize'
                        && this.state.estimateGas && ((lang === 'zh' ? '估算' : 'estimated') + '   ' + normalizeBTMAmountUnit(btmID,
                          option.ratio * this.state.estimateGas,
                          this.props.btmAmountUnit))
                      }
                      {
                        option.label === 'Customize' && gas.type.value === 'Customize' &&
                        <div>
                          <AmountUnitField
                            autoFocus={true}
                            fieldProps={gas.price}
                            placeholder='Enter gas'/>
                        </div>
                      }
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <label className={styles.title}>{lang === 'zh' ? '密码' : 'Password'}</label>
            <PasswordField
              placeholder={lang === 'zh' ? '请输入密码' : 'Please enter the password'}
              fieldProps={password}
            />
          </FormSection>

          <FormSection className={styles.submitSection}>
            {error &&
            <ErrorBanner
              title='Error submitting form'
              error={error} />}

            <div className={styles.submit}>
              <button type='submit' className='btn btn-primary' disabled={submitting || this.disableSubmit(this.props.fields)}>
                {submitLabel ||  ( lang === 'zh' ? '提交' : 'Submit' )}
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
      'gas',
      'gas.type',
      'gas.price',
      'address',
      'submitAction',
      'password'
    ],
    asyncValidate,
    asyncBlurFields: [ 'address'],
    validate,
    touchOnChange: true,
    initialValues: {
      submitAction: 'submit',
    },
  }
  )(NormalTxForm)
)


