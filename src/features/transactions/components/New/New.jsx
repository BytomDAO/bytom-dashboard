import { BaseNew, FormContainer, FormSection, FieldLabel, TextField, Autocomplete, ObjectSelectorField, AmountUnitField } from 'features/shared/components'
import { DropdownButton, MenuItem } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import ActionItem from './FormActionItem'
import React from 'react'
import styles from './New.scss'
import balanceActions from 'features/balances/actions'
import { normalizeBTMAmountUnit } from 'utility/buildInOutDisplay'

const rangeOptions = [
  {
    label: 'Standard',
    label_zh: '标准',
    value: '20000000'
  },
  {
    label: 'Fast',
    label_zh: '快速',
    value: '25000000'
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

    this.props.fields.normalTransaction.gas.type.onChange(rangeOptions[0].label)
    this.props.fields.normalTransaction.gas.price.onChange(rangeOptions[0].value)
  }

  balanceAmount(normalTransaction) {
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

    return filteredBalances.length === 1 ? normalizeBTMAmountUnit(filteredBalances[0].assetId, filteredBalances[0].amount, this.props.btmAmountUnit) : null
  }

  toggleDropwdown() {
    this.setState({ showDropdown: !this.state.showDropdown })
  }

  closeDropdown() {
    this.setState({ showDropdown: false })
  }

  addActionItem(type) {
    this.props.fields.actions.addField({
      type: type,
      referenceData: '{\n\t\n}'
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
      (hasValue(normalTransaction.assetId)|| hasValue(normalTransaction.assetAlias)) &&
      hasValue(normalTransaction.address) && (hasValue(normalTransaction.amount)))
  }

  removeActionItem(index) {
    this.props.fields.actions.removeField(index)
  }

  emptyActions(actions){
    if(actions.length != 0){
      actions.map(()=> this.removeActionItem(0))
    }
  }

  submitWithValidation(data) {
    return new Promise((resolve, reject) => {
      this.props.submitForm(data)
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


  render() {
    const {
      fields: { baseTransaction, actions, submitAction, password, normalTransaction },
      error,
      handleSubmit,
      submitting
    } = this.props
    const lang = this.props.lang

    let submitLabel = lang === 'zh' ? '提交交易' : 'Submit transaction'
    if (submitAction.value == 'generate') {
      submitLabel = lang === 'zh' ? '生成交易hex' : 'Generate transaction hex'
    }

    const gasOnChange = event => {
      normalTransaction.gas.type.onChange(event)

      const range = rangeOptions.find(item => item.label === event.target.value)
      normalTransaction.gas.price.onChange(range.value)
    }

    const showAvailableBalance = (normalTransaction.accountAlias.value || normalTransaction.accountId.value) &&
      (normalTransaction.assetAlias.value || normalTransaction.assetId.value)
    const availableBalance = this.balanceAmount(normalTransaction)

    const showBtmAmountUnit = (normalTransaction.assetAlias.value === 'BTM' ||
      normalTransaction.assetId.value === 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')

    return(
      <FormContainer
        error={error}
        label={ lang === 'zh' ? '新建交易' :'New transaction' }
        submitLabel={submitLabel}
        onSubmit={handleSubmit(this.submitWithValidation)}
        showSubmitIndicator={true}
        submitting={submitting}
        disabled={this.disableSubmit(actions, normalTransaction)} >


        <div className={`btn-group ${styles.btnGroup}`} role='group'>
          <button
            className={`btn btn-default ${this.state.showAdvanceTx ? null: 'active'}`}
            onClick={(e) => {
              e.preventDefault()
              this.emptyActions(actions)
              this.setState({showAdvanceTx: false})
            }} >
            { lang === 'zh' ? '简单交易' : 'Normal' }
          </button>
          <button
            className={`btn btn-default ${this.state.showAdvanceTx ? 'active': null}`}
            onClick={(e) => {
              e.preventDefault()
              this.setState({showAdvanceTx: true})
            }} >
            { lang === 'zh' ? '高级交易' : 'Advanced' }
          </button>
        </div>

        { !this.state.showAdvanceTx && <FormSection title={ lang === 'zh' ? '简单交易' : 'Normal Trasaction' }>
          <label className={styles.title}>{ lang === 'zh' ? '从' : 'From' }</label>
          <div className={styles.main}>
            <ObjectSelectorField
              title={ lang === 'zh' ? '账户' :'Account' }
              aliasField={Autocomplete.AccountAlias}
              fieldProps={{
                id: normalTransaction.accountId,
                alias: normalTransaction.accountAlias
              }}
            />
            <ObjectSelectorField
              title={ lang === 'zh' ? '资产' : 'Asset' }
              aliasField={Autocomplete.AssetAlias}
              fieldProps={{
                id: normalTransaction.assetId,
                alias: normalTransaction.assetAlias
              }}
            />
            {showAvailableBalance && availableBalance &&
            <small className={styles.balanceHint}>{availableBalance} available</small>}
          </div>

          <label className={styles.title}>{ lang === 'zh' ? '至' : 'To' }</label>
          <div className={styles.main}>
            <TextField title='Address' fieldProps={normalTransaction.address}/>
            {!showBtmAmountUnit && <TextField title='Amount' fieldProps={normalTransaction.amount}
            />}
            {showBtmAmountUnit && <AmountUnitField title='Amount' fieldProps={normalTransaction.amount}
            />}
          </div>

          <label className={styles.title}>Gas</label>
          <table className={styles.optionsBtnContianer}>
              {rangeOptions.map((option) =>
                <tr className={styles.optionsBtn}>
                  <td className={styles.optionsLabel}>
                    <label >
                      <input type='radio'
                             {...normalTransaction.gas.type}
                             onChange={gasOnChange}
                             value={option.label}
                             checked={option.label == normalTransaction.gas.type.value}
                      />
                      { lang === 'zh' ? option.label_zh :  option.label }
                    </label>
                  </td>
                  <td>
                    { option.label == normalTransaction.gas.type.value&& option.label !== 'Customize'
                    && normalizeBTMAmountUnit(btmID, option.value, this.props.btmAmountUnit) }
                    {
                      option.label === 'Customize' && normalTransaction.gas.type.value === 'Customize' &&
                      <div>
                        <AmountUnitField
                          autoFocus={true}
                          fieldProps={normalTransaction.gas.price}
                          placeholder='Enter gas' />
                      </div>
                    }
                  </td>
                </tr>
              )}
          </table>

        </FormSection>}

        { this.state.showAdvanceTx && <FormSection title='Actions'>
          {actions.map((action, index) =>
            <ActionItem
              key={index}
              index={index}
              fieldProps={action}
              accounts={this.props.accounts}
              assets={this.props.assets}
              remove={this.removeActionItem}
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
              <MenuItem eventKey='control_receiver'>Control with receiver</MenuItem>
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
              { lang === 'zh' ? '显示高级选项' : 'Show advanced options'}
            </a>
          </FormSection>
        }

        {this.state.showAdvanceTx && this.state.showAdvanced && <FormSection title={ lang === 'zh' ? '高级选项' :'Advanced Options' }>
          <div>
            <TextField
              title='Base transaction'
              placeholder='Paste transaction hex here...'
              fieldProps={baseTransaction}
              autoFocus={true} />

            <FieldLabel>Transaction Build Type</FieldLabel>
            <table className={styles.submitTable}>
              <tbody>
              <tr>
                <td><input id='submit_action_submit' type='radio' {...submitAction} value='submit' checked={submitAction.value == 'submit'} /></td>
                <td>
                  <label htmlFor='submit_action_submit'>{ lang === 'zh' ? '向区块链提交交易' :'Submit transaction to blockchain' }</label>
                  <br />
                  <label htmlFor='submit_action_submit' className={styles.submitDescription}>
                    { lang === 'zh' ? '此次交易将通过密钥签名然后提交到区块链。' :
                      'This transaction will be signed by the MockHSM and submitted to the blockchain.' }
                  </label>
                </td>
              </tr>
              <tr>
                <td><input id='submit_action_generate' type='radio' {...submitAction} value='generate' checked={submitAction.value == 'generate'} /></td>
                <td>
                  <label htmlFor='submit_action_generate'>{ lang === 'zh' ? '允许更多actions' : 'Allow additional actions' }</label>
                  <br />
                  <label htmlFor='submit_action_generate' className={styles.submitDescription}>
                    { lang === 'zh' ? '这些actions将通过密钥签名然后作为一个交易 hex 字符串返回， 字符串可以用做base transaction于 multi-party swap。' +
                      '此次交易将持续有效一个小时。' :
                      'These actions will be signed by the MockHSM and returned as a transaction hex string, ' +
                      'which should be used as the base transaction in a multi-party swap. This transaction ' +
                      'will be valid for one hour.'  }
                  </label>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </FormSection>}
      </FormContainer>
    )
  }
}

const validate = values => {
  const errors = {actions: {}, normalTransaction:{gas:{}}}

  // Base transaction
  let baseTx = values.baseTransaction || ''
  if (baseTx.trim().match(/[^0-9a-fA-F]/)) {
    errors.baseTransaction = 'Base transaction must be a hex string.'
  }

  // Actions
  let numError
  values.actions.forEach((action, index) => {
    numError = (!/^\d+(\.\d+)?$/i.test(values.actions[index].amount))
    if ( numError) {
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
      autocompleteIsLoaded: state.key.autocompleteIsLoaded,
      lang: state.core.lang,
      btmAmountUnit: state.core.btmAmountUnit,
      balances,
      ...BaseNew.mapStateToProps('transaction')(state)
    }
  },
  (dispatch) => ({
    didLoadAutocomplete: () => dispatch(balanceActions.didLoadAutocomplete),
    fetchAll: (cb) => dispatch(balanceActions.fetchAll(cb)),
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
      'actions[].receiver',
      'actions[].outputId',
      'actions[].referenceData',
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
    initialValues: {
      submitAction: 'submit',
    },
  }
  )(Form)
)


