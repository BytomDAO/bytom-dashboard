import {
  BaseNew,
  FormContainer,
  FormSection,
  FieldLabel,
  TextField,
  Autocomplete,
  ObjectSelectorField,
  AmountUnitField,
  AmountInputMask
} from 'features/shared/components'
import {DropdownButton, MenuItem} from 'react-bootstrap'
import {chainClient} from 'utility/environment'
import {reduxForm} from 'redux-form'
import ActionItem from './FormActionItem'
import React from 'react'
import styles from './New.scss'
import actions from 'actions'
import { normalizeBTMAmountUnit, converIntToDec } from 'utility/buildInOutDisplay'

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

const btmID = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

class Form extends React.Component {
  constructor(props) {
    super(props)
    this.connection = chainClient().connection
    this.state = {
      showDropdown: false,
      showAdvanced: false
    }

    this.submitWithValidation = this.submitWithValidation.bind(this)
    this.addActionItem = this.addActionItem.bind(this)
    this.removeActionItem = this.removeActionItem.bind(this)
    this.toggleDropwdown = this.toggleDropwdown.bind(this)
    this.closeDropdown = this.closeDropdown.bind(this)
    this.disableSubmit = this.disableSubmit.bind(this)
  }

  componentDidMount() {
    if (!this.props.autocompleteIsLoaded) {
      this.props.fetchAll().then(() => {
        this.props.didLoadAutocomplete()
      })
    }
    if (!this.props.autocompleteIsAssetLoaded) {
      this.props.fetchAssetAll().then(() => {
        this.props.didLoadAssetAutocomplete()
      })
    }

    this.props.fields.normalTransaction.gas.type.onChange(rangeOptions[0].label)
    this.props.fields.normalTransaction.gas.price.onChange(rangeOptions[0].value)
  }

  balanceAmount(normalTransaction, assetdecimal) {
    let balances = this.props.balances
    let filteredBalances = balances
    if (normalTransaction.accountAlias.value) {
      filteredBalances = filteredBalances.filter(balance => balance.accountAlias === normalTransaction.accountAlias.value)
    }
    if (normalTransaction.accountId.value) {
      filteredBalances = filteredBalances.filter(balance => balance.accountId === normalTransaction.accountId.value)
    }
    if (normalTransaction.assetAlias.value) {
      filteredBalances = filteredBalances.filter(balance => balance.assetAlias === normalTransaction.assetAlias.value)
    }
    if (normalTransaction.assetId.value) {
      filteredBalances = filteredBalances.filter(balance => balance.assetId === normalTransaction.assetId.value)
    }

    if(filteredBalances.length === 1){
      if (filteredBalances[0].assetId === btmID){
        return normalizeBTMAmountUnit(filteredBalances[0].assetId, filteredBalances[0].amount, this.props.btmAmountUnit)
      }else if( assetdecimal ){
        return converIntToDec(filteredBalances[0].amount, assetdecimal)
      }else{
        return filteredBalances[0].amount
      }
    }else {
      return null
    }
  }

  assetDecimal(normalTransaction) {
    let asset = this.props.asset
    let filteredAsset = asset
    if (normalTransaction.assetAlias.value) {
      filteredAsset = filteredAsset.filter(asset => asset.alias === normalTransaction.assetAlias.value)
    }
    if (normalTransaction.assetId.value) {
      filteredAsset = filteredAsset.filter(asset => asset.id === normalTransaction.assetId.value)
    }

    return (filteredAsset.length === 1 && filteredAsset[0].definition && filteredAsset[0].id !== btmID ) ? filteredAsset[0].definition.decimals : null
  }

  toggleDropwdown() {
    this.setState({showDropdown: !this.state.showDropdown})
  }

  closeDropdown() {
    this.setState({showDropdown: false})
  }

  addActionItem(type) {
    this.props.fields.actions.addField({
      type: type,
    })
    this.closeDropdown()
  }

  disableSubmit(actions, normalTransaction) {
    if (this.state.showAdvanceTx) {
      return actions.length == 0 && !this.state.showAdvanced
    }

    const hasValue = target => {
      return !!(target && target.value)
    }

    return !((hasValue(normalTransaction.accountId) || hasValue(normalTransaction.accountAlias)) &&
      (hasValue(normalTransaction.assetId) || hasValue(normalTransaction.assetAlias)) &&
      hasValue(normalTransaction.address) && (hasValue(normalTransaction.amount)))
  }

  removeActionItem(index) {
    this.props.fields.actions.removeField(index)
  }

  emptyActions(actions) {
    if (actions.length != 0) {
      actions.map(() => this.removeActionItem(0))
    }
  }

  submitWithValidation(data) {
    return new Promise((resolve, reject) => {
      this.props.submitForm(Object.assign({}, data, {state: this.state}))
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
    const transaction = this.props.fields.normalTransaction
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
        this.props.showError(new Error(resp.msg))
        return
      }

      return this.connection.request('/estimate-transaction-gas', {
        transactionTemplate: resp.data
      }).then(resp => {
        if (resp.status === 'fail') {
          this.props.showError(new Error(resp.msg))
          return
        }
        this.setState({estimateGas: resp.data.totalNeu})
      })
    })
  }

  render() {
    const {
      fields: {baseTransaction, actions, submitAction, password, normalTransaction},
      error,
      handleSubmit,
      submitting
    } = this.props
    const lang = this.props.lang;
    ['amount', 'accountAlias', 'accountId', 'assetAlias', 'assetId', 'address'].forEach(key => {
      normalTransaction[key].onBlur = this.estimateNormalTransactionGas.bind(this)
    })

    let submitLabel = lang === 'zh' ? '提交交易' : 'Submit transaction'
    const hasBaseTransaction = ((baseTransaction.value || '').trim()).length > 0
    if (submitAction.value == 'generate' && !hasBaseTransaction) {
      submitLabel = lang === 'zh' ? '生成交易JSON' : 'Generate transaction JSON'
    }

    const gasOnChange = event => {
      normalTransaction.gas.type.onChange(event)

      const range = rangeOptions.find(item => item.label === event.target.value)
      normalTransaction.gas.price.onChange(range.value)
    }
    const assetDecimal = this.assetDecimal(normalTransaction)

    const showAvailableBalance = (normalTransaction.accountAlias.value || normalTransaction.accountId.value) &&
      (normalTransaction.assetAlias.value || normalTransaction.assetId.value)
    const availableBalance = this.balanceAmount(normalTransaction, assetDecimal)

    const showBtmAmountUnit = (normalTransaction.assetAlias.value === 'BTM' ||
      normalTransaction.assetId.value === 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')

    return (
      <FormContainer
        error={error}
        label={lang === 'zh' ? '新建交易' : 'New transaction'}
        submitLabel={submitLabel}
        onSubmit={handleSubmit(this.submitWithValidation)}
        showSubmitIndicator={true}
        submitting={submitting}
        disabled={this.disableSubmit(actions, normalTransaction)}>

        <div className={`btn-group ${styles.btnGroup}`} role='group'>
          <button
            className={`btn btn-default ${this.state.showAdvanceTx ? null : 'active'}`}
            onClick={(e) => {
              e.preventDefault()
              this.emptyActions(actions)
              this.setState({showAdvanceTx: false})
            }}>
            {lang === 'zh' ? '简单交易' : 'Normal'}
          </button>
          <button
            className={`btn btn-default ${this.state.showAdvanceTx ? 'active' : null}`}
            onClick={(e) => {
              e.preventDefault()
              this.setState({showAdvanceTx: true})
            }}>
            {lang === 'zh' ? '高级交易' : 'Advanced'}
          </button>
        </div>

        {!this.state.showAdvanceTx && <FormSection title={lang === 'zh' ? '简单交易' : 'Normal Trasaction'}>
          <label className={styles.title}>{lang === 'zh' ? '从' : 'From'}</label>
          <div className={styles.main}>
            <ObjectSelectorField
              key='account-selector-field'
              lang={lang}
              title={lang === 'zh' ? '账户' : 'Account'}
              aliasField={Autocomplete.AccountAlias}
              fieldProps={{
                id: normalTransaction.accountId,
                alias: normalTransaction.accountAlias
              }}
            />
            <ObjectSelectorField
              key='asset-selector-field'
              lang={lang}
              title={lang === 'zh' ? '资产' : 'Asset'}
              aliasField={Autocomplete.AssetAlias}
              fieldProps={{
                id: normalTransaction.assetId,
                alias: normalTransaction.assetAlias
              }}
            />
            {showAvailableBalance && availableBalance &&
            <small className={styles.balanceHint}>{availableBalance} {lang === 'zh' ? '可用' : 'available'} </small>}
          </div>

          <label className={styles.title}>{lang === 'zh' ? '至' : 'To'}</label>
          <div className={styles.main}>
            <TextField title={lang === 'zh' ? '地址' : 'Address'} fieldProps={normalTransaction.address}/>
            {!showBtmAmountUnit && !assetDecimal &&
            <TextField title={lang === 'zh' ? '数量' : 'Amount'} fieldProps={normalTransaction.amount}
            />}
            {!showBtmAmountUnit && assetDecimal &&
            <AmountInputMask title={lang === 'zh' ? '数量' : 'Amount'} fieldProps={normalTransaction.amount} decimal={assetDecimal}
            />}
            {showBtmAmountUnit &&
            <AmountUnitField title={lang === 'zh' ? '数量' : 'Amount'} fieldProps={normalTransaction.amount}/>
            }
          </div>

          <label className={styles.title}>Gas</label>
          <table className={styles.optionsBtnContianer}>
            {rangeOptions.map((option) =>
              <tr className={styles.optionsBtn}>
                <td className={styles.optionsLabel}>
                  <label>
                    <input type='radio'
                           {...normalTransaction.gas.type}
                           onChange={gasOnChange}
                           value={option.label}
                           checked={option.label == normalTransaction.gas.type.value}
                    />
                    {lang === 'zh' ? option.label_zh : option.label}
                  </label>
                </td>
                <td>
                  {
                    option.label == normalTransaction.gas.type.value && option.label !== 'Customize'
                    && this.state.estimateGas && ((lang === 'zh' ? '估算' : 'estimated') + '   ' + normalizeBTMAmountUnit(btmID,
                      option.ratio * this.state.estimateGas,
                      this.props.btmAmountUnit))
                  }
                  {
                    option.label === 'Customize' && normalTransaction.gas.type.value === 'Customize' &&
                    <div>
                      <AmountUnitField
                        autoFocus={true}
                        fieldProps={normalTransaction.gas.price}
                        placeholder='Enter gas'/>
                    </div>
                  }
                </td>
              </tr>
            )}
          </table>

          <label className={styles.title}>{lang === 'zh' ? '密码' : 'Password'}</label>
          <TextField placeholder={lang === 'zh' ? '请输入密码' : 'Please enter the assword'} fieldProps={password}
                     autoFocus={false} type={'password'}/>
        </FormSection>}

        {this.state.showAdvanceTx && <FormSection title='Actions'>
          {actions.map((action, index) =>
            <ActionItem
              key={index}
              index={index}
              fieldProps={action}
              accounts={this.props.accounts}
              assets={this.props.assets}
              remove={this.removeActionItem}
              lang={lang}
              decimal={this.assetDecimal(action)}
            />)}

          <div className={`btn-group ${styles.addActionContainer} ${this.state.showDropdown && 'open'}`}>
            <DropdownButton
              className={`btn btn-default ${styles.addAction}`}
              id='input-dropdown-addon'
              title='+ Add action'
              onSelect={this.addActionItem}
            >
              <MenuItem eventKey='issue'>Issue</MenuItem>
              <MenuItem eventKey='spend_account'>Spend from account</MenuItem>
              <MenuItem eventKey='control_address'>Control with address</MenuItem>
              <MenuItem eventKey='retire'>Retire</MenuItem>
            </DropdownButton>
          </div>
        </FormSection>}

        {this.state.showAdvanceTx && !this.state.showAdvanced &&
        <FormSection>
          <a href='#'
             className={styles.showAdvanced}
             onClick={(e) => {
               e.preventDefault()
               this.setState({showAdvanced: true})
             }}
          >
            {lang === 'zh' ? '显示高级选项' : 'Show advanced options'}
          </a>
        </FormSection>
        }

        {this.state.showAdvanceTx && this.state.showAdvanced &&
        <FormSection title={lang === 'zh' ? '高级选项' : 'Advanced Options'}>
          <div>
            <TextField
              title={lang === 'zh' ? '带签名交易' : 'To sign transaction'}
              placeholder={lang === 'zh' ? '在这里复制交易 HEX ...' : 'Paste transaction hex here...'}
              fieldProps={baseTransaction}
              autoFocus={true}/>

            <FieldLabel>{lang === 'zh' ? '交易构建类型' : 'Transaction Build Type'}</FieldLabel>
            <table className={styles.submitTable}>
              <tbody>
              <tr>
                <td><input id='submit_action_submit' type='radio' {...submitAction} value='submit'
                           checked={submitAction.value == 'submit'}/></td>
                <td>
                  <label
                    htmlFor='submit_action_submit'>{lang === 'zh' ? '向区块链提交交易' : 'Submit transaction to blockchain'}</label>
                  <br/>
                  <label htmlFor='submit_action_submit' className={styles.submitDescription}>
                    {lang === 'zh' ? '此次交易将通过密钥签名然后提交到区块链。' :
                      'This transaction will be signed by the MockHSM and submitted to the blockchain.'}
                  </label>
                </td>
              </tr>
              <tr>
                <td><input id='submit_action_generate' type='radio' {...submitAction} value='generate'
                           checked={submitAction.value == 'generate'}/></td>
                <td>
                  <label htmlFor='submit_action_generate'>{lang === 'zh' ? '需要更多签名' : 'Need more signature'}</label>
                  <br/>
                  <label htmlFor='submit_action_generate' className={styles.submitDescription}>
                    {lang === 'zh' ? '这些actions将通过密钥签名然后作为一个交易 JSON 字符串返回。 作为多签交易的输入，这个JSON字符串需要更多的签名数据。' :
                      'These actions will be signed by the Key and returned as a transaction JSON string, ' +
                      'which should be used to sign transaction in a multi-sign spend.'}
                  </label>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </FormSection>}

        {
          this.state.showAdvanceTx && (actions.length > 0 || this.state.showAdvanced) && <FormSection>
            <label className={styles.title}>{lang === 'zh' ? '密码' : 'Password'}</label>
            <TextField placeholder={lang === 'zh' ? '请输入密码' : 'Please enter the assword'} fieldProps={password}
                       autoFocus={false} type={'password'}/>
          </FormSection>
        }
      </FormContainer>
    )
  }
}

const validate = values => {
  const errors = {actions: {}, normalTransaction: {gas: {}}}

  // Base transaction
  let baseTx = (values.baseTransaction || '').trim()
  try {
    JSON.parse(baseTx)
  } catch (e) {
    if (baseTx && e) {
      errors.baseTransaction = 'To sign transaction must be a JSON string.'
    }
  }

  // Actions
  let numError
  values.actions.forEach((action, index) => {
    numError = (!/^\d+(\.\d+)?$/i.test(values.actions[index].amount))
    if (numError) {
      errors.actions[index] = {...errors.actions[index], amount: 'Invalid amount type'}
    }
  })

  // Numerical
  let normalTx = values.normalTransaction || ''
  if (normalTx.amount && !/^\d+(\.\d+)?$/i.test(normalTx.amount)) {
    errors.normalTransaction.amount = 'Invalid amount type'
  }
  return errors
}

export default BaseNew.connect(
  (state) => {
    let balances = []
    for (let key in state.balance.items) {
      balances.push(state.balance.items[key])
    }

    return {
      autocompleteIsLoaded: state.balance.autocompleteIsLoaded,
      autocompleteIsAssetLoaded: state.balance.autocompleteIsLoaded,
      lang: state.core.lang,
      btmAmountUnit: state.core.btmAmountUnit,
      balances,
      asset: Object.keys(state.asset.items).map(k => state.asset.items[k]),
      ...BaseNew.mapStateToProps('transaction')(state)
    }
  },
  (dispatch) => ({
    didLoadAutocomplete: () => dispatch(actions.balance.didLoadAutocomplete),
    fetchAll: (cb) => dispatch(actions.balance.fetchAll(cb)),
    didLoadAssetAutocomplete: () => dispatch(actions.asset.didLoadAutocomplete),
    fetchAssetAll: (cb) => dispatch(actions.asset.fetchAll(cb)),
    showError: err => dispatch({type: 'ERROR', payload: err}),
    ...BaseNew.mapDispatchToProps('transaction')(dispatch)
  }),
  reduxForm({
    form: 'NewTransactionForm',
    fields: [
      'baseTransaction',
      'actions[].accountId',
      'actions[].accountAlias',
      'actions[].assetId',
      'actions[].assetAlias',
      'actions[].amount',
      'actions[].outputId',
      'actions[].type',
      'actions[].address',
      'actions[].password',
      'normalTransaction.accountAlias',
      'normalTransaction.accountId',
      'normalTransaction.amount',
      'normalTransaction.assetAlias',
      'normalTransaction.assetId',
      'normalTransaction.gas',
      'normalTransaction.gas.type',
      'normalTransaction.gas.price',
      'normalTransaction.address',
      'submitAction',
      'password'
    ],
    validate,
    touchOnChange: true,
    initialValues: {
      submitAction: 'submit',
    },
  }
  )(Form)
)


