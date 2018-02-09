import { BaseNew, FormContainer, FormSection, FieldLabel, JsonField, TextField, Autocomplete, ObjectSelectorField, SelectField } from 'features/shared/components'
import { DropdownButton, MenuItem } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import ActionItem from './FormActionItem'
import React from 'react'
import styles from './New.scss'
import balanceActions from 'features/balances/actions'


const rangeOptions = [250000000, 200000000, 100000000].map(val => ({label: val+' BTM', value: val}))

class Form extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showDropdown: false
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
  }

  // balanceWidgetUnconnected({ accountId, accountAlias, assetId, assetAlias }) {
  balanceAmount(accountAlias, assetAlias ) {
    if(accountAlias != '' && assetAlias != ''){
      let balances = this.props.balances
      for(let key in balances){
        if(balances[key].accountAlias == accountAlias && balances[key].assetAlias == assetAlias){
          return balances[key].amount
        }
      }
    }
    return
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
    // let isNormalShow = true
    // for (let key in normalTransaction){
    //   isNormalShow = isNormalShow & normalTransaction[key].dirty
    // }
    // return !isNormalShow & actions.length == 0 & !this.state.showAdvanced
    // return  actions.length == 0 & !this.state.showAdvanced
    return  false
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

    let submitLabel = 'Submit transaction'
    if (submitAction.value == 'generate') {
      submitLabel = 'Generate transaction hex'
    }

    return(
      <FormContainer
        error={error}
        label='New transaction'
        submitLabel={submitLabel}
        onSubmit={handleSubmit(this.submitWithValidation)}
        showSubmitIndicator={true}
        submitting={submitting}
        disabled={this.disableSubmit(actions, normalTransaction)} >


        <div className={`btn-group ${styles.btnGroup}`} role='group'>
          <button
            className={`btn btn-default ${this.state.showAdvance ? null: 'active'}`}
            onClick={(e) => {
              e.preventDefault()
              this.emptyActions(actions)
              this.setState({showAdvance: false})
            }} >
            Normal
          </button>

          <button
            className={`btn btn-default ${this.state.showAdvance ? 'active': null}`}
            onClick={(e) => {
              e.preventDefault()
              this.setState({showAdvance: true})
            }} >
            Advanced
          </button>
        </div>

        { !this.state.showAdvance && <FormSection title='Normal Trasaction'>
          <label className={styles.title}>From</label>
          <div className={styles.main}>
            <ObjectSelectorField
              title='Account'
              aliasField={Autocomplete.AccountAlias}
              fieldProps={{
                id: normalTransaction.accountId,
                alias: normalTransaction.accountAlias
              }}
            />
            <ObjectSelectorField
              title='Asset'
              aliasField={Autocomplete.AssetAlias}
              fieldProps={{
                id: normalTransaction.assetId,
                alias: normalTransaction.assetAlias
              }}
            />
          </div>

          <label className={styles.title}>To</label>
          <div className={styles.main}>
            <TextField title='Address' fieldProps={normalTransaction.address}/>
            <TextField title='Amount' fieldProps={normalTransaction.amount}/>
            <small className='value-balance'>{this.balanceAmount(normalTransaction.accountAlias.value,
              normalTransaction.assetAlias.value)} available</small>
          </div>

          <label className={styles.title}>Gas</label>

          <div className={styles.optionsBtnContianer}>
            {/*<SelectField options={rangeOptions}*/}
                         {/*title='Gas'*/}
                         {/*skipEmpty={true}*/}
                         {/*fieldProps={normalTransaction.gas} />*/}
            {rangeOptions.map((option) =>
              <label className={styles.optionsBtn}>
                <input type='radio'
                {...normalTransaction.gas}
                value={option.value}
                />
                {option.label}
              </label>
            )}
          </div>

        </FormSection>}

        { this.state.showAdvance && <FormSection title='Actions'>
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
              {/*<MenuItem eventKey='spend_account_unspent_output'>Spend unspent output</MenuItem>*/}
              <MenuItem eventKey='control_account'>Control with account</MenuItem>
              <MenuItem eventKey='control_receiver'>Control with receiver</MenuItem>
              <MenuItem eventKey='control_address'>Control with address</MenuItem>
              <MenuItem eventKey='retire'>Retire</MenuItem>
              {/*<MenuItem eventKey='set_transaction_reference_data'>Set transaction reference data</MenuItem>*/}
            </DropdownButton>
          </div>
        </FormSection>}

        {false && !this.state.showAdvanced &&
        <FormSection>
          <a href='#'
             className={styles.showAdvanced}
             onClick={(e) => {
               e.preventDefault()
               this.setState({showAdvanced: true})
             }}
          >
            Show advanced options
          </a>
        </FormSection>
        }

        {false && this.state.showAdvanced && <FormSection title='Advanced Options'>
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
                  <label htmlFor='submit_action_submit'>Submit transaction to blockchain</label>
                  <br />
                  <label htmlFor='submit_action_submit' className={styles.submitDescription}>
                    This transaction will be signed by the MockHSM and submitted to the blockchain.
                  </label>
                </td>
              </tr>
              <tr>
                <td><input id='submit_action_generate' type='radio' {...submitAction} value='generate' checked={submitAction.value == 'generate'} /></td>
                <td>
                  <label htmlFor='submit_action_generate'>Allow additional actions</label>
                  <br />
                  <label htmlFor='submit_action_generate' className={styles.submitDescription}>
                    These actions will be signed by the MockHSM and returned as a
                    transaction hex string, which should be used as the base
                    transaction in a multi-party swap. This transaction will be
                    valid for one hour.
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
  const errors = {actions: {}}

  // Base transaction
  let baseTx = values.baseTransaction || ''
  if (baseTx.trim().match(/[^0-9a-fA-F]/)) {
    errors.baseTransaction = 'Base transaction must be a hex string.'
  }

  // Actions
  let fieldError
  values.actions.forEach((action, index) => {
    fieldError = JsonField.validator(values.actions[index].referenceData)
    if (fieldError) {
      errors.actions[index] = {...errors.actions[index], referenceData: fieldError}
    }
  })

  return errors
}

export default BaseNew.connect(
  (state) => {
    let balances = []
    for (var key in state.balance.items) {
      const item = state.balance.items[key]
      balances.push({
        ...item,
        // label: item.alias ? item.alias : item.id.slice(0, 32) + '...'
      })
    }

    return {
      autocompleteIsLoaded: state.key.autocompleteIsLoaded,
      balances: balances,
      ...BaseNew.mapStateToProps('transaction')(state)
    }
  },
  (dispatch) => ({
    didLoadAutocomplete: () => dispatch(balanceActions.didLoadAutocomplete),
    fetchAll: (cb) => dispatch(balanceActions.fetchAll(cb)),
    ...BaseNew.mapDispatchToProps('transaction')
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


