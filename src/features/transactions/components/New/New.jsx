import { BaseNew, FormContainer, FormSection, FieldLabel, JsonField, TextField } from 'features/shared/components'
import { DropdownButton, MenuItem } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import ActionItem from './FormActionItem'
import React from 'react'
import styles from './New.scss'

class Form extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showDropdown: false
    }

    this.submitWithValidation = this.submitWithValidation.bind(this)
    this.addActionItem = this.addActionItem.bind(this)
    // this.normalAction = this.normalAction.bind(this)
    this.removeActionItem = this.removeActionItem.bind(this)
    this.toggleDropwdown = this.toggleDropwdown.bind(this)
    this.closeDropdown = this.closeDropdown.bind(this)
    this.disableSubmit = this.disableSubmit.bind(this)
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

  normalAction(){
    const actions = this.props.fields.actions
    //gas
    actions.addField({
      type: 'spend_account',
      assetAlias: 'btm',
      referenceData: '{\n\t\n}'
    })
    //spend from
    actions.addField({
      type: 'spend_account',
      referenceData: '{\n\t\n}'
    })
    //address
    actions.addField({
      type: 'control_address',
      referenceData: '{\n\t\n}'
    })
  }

  // normalAction(normalTransaction){
  //   const actions = this.props.fields.actions
  //   //gas
  //   actions.addField({
  //     type: 'spend_account',
  //     accountAlias: normalTransaction.account.value,
  //     assetAlias: 'btm',
  //     amount: normalTransaction.gas.value,
  //     referenceData: '{\n\t\n}'
  //   })
  //   //spend from
  //   actions.addField({
  //     type: 'spend_account',
  //     accountAlias: normalTransaction.account.value,
  //     assetAlias: normalTransaction.asset.value,
  //     amount: normalTransaction.amount.value,
  //     referenceData: '{\n\t\n}'
  //   })
  //   //address
  //   actions.addField({
  //     type: 'control_address',
  //     address: normalTransaction.address.value,
  //     assetAlias: normalTransaction.asset.value,
  //     amount: normalTransaction.amount.value,
  //     referenceData: '{\n\t\n}'
  //   })
  // }

  emptyActionItem(actions){
    actions.map(() => this.removeActionItem())
  }

  disableSubmit(actions) {
    return actions.length == 0 & !this.state.showAdvanced
  }

  removeActionItem(index) {
    this.props.fields.actions.removeField(index)
  }

  submitWithValidation(data) {
    // this.normalAction(this.props.fields.normalTransaction)
    // debugger
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
    // const { account, amount, asset, gas, address } = this.props.fieldProps

    // const valueOnChange = event => {
    //   const value = this.props.onChange(event).value
    //   actions[1].assetAlias.value = value
    //   // this.setState({actions[1].accountAlias : value })
    // }

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
        // disabled={this.disableSubmit(actions)} >
        disabled={false} >


        <div className={`btn-group ${styles.btnGroup}`} role='group'>
          <button
            className={`btn btn-default ${styles.btn} ${this.props.normalButtonStyle}`}
            onClick={(e) => {
              e.preventDefault()
              this.setState({showAdvance: false})
            }} >
            Normal
          </button>

          <button
            className={`btn btn-default ${styles.btn} ${this.props.advancedButtonStyle}`}
            onClick={(e) => {
              e.preventDefault()
              this.setState({showAdvance: true})
            }} >
            Advanced
          </button>
        </div>

        { !this.state.showAdvance && <FormSection title='Normal Trasaction'>
          <TextField title='Account' fieldProps={normalTransaction.account}/>
          <TextField title='Asset' fieldProps={normalTransaction.asset}/>
          <TextField title='Amount' fieldProps={normalTransaction.amount}/>
          <TextField title='Gas' fieldProps={normalTransaction.gas}/>
          <TextField title='Address' fieldProps={normalTransaction.address}/>
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
                {/*<MenuItem eventKey='normal_mode'>normal</MenuItem>*/}
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
  const normalT = values.normalTransaction
  values.actions.push({accountAlias: normalT.account, assetAlias: 'btm', amount: normalT.gas, type: 'spend_account'})
  values.actions.push({accountAlias: normalT.account, assetAlias: normalT.asset, amount: normalT.amount, type: 'spend_account'})
  values.actions.push({address: normalT.address, assetAlias: normalT.asset, amount: normalT.amount, type: 'control_address'})

  // debugger

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
  (state) => ({
    ...BaseNew.mapStateToProps('transaction')(state)
  }),
  BaseNew.mapDispatchToProps('transaction'),
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
      'normalTransaction.account',
      'normalTransaction.amount',
      'normalTransaction.asset',
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


