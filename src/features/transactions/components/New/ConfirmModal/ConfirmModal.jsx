import React, { Component } from 'react'
import {reduxForm} from 'redux-form'
import {PasswordField} from 'features/shared/components'
import { btmID } from 'utility/environment'

class ConfirmModal extends Component {
  render() {
    const {
      fields: { assetId, assetAlias, address, amount, password, gasLevel },
      handleSubmit,
      gas,
      lang
    } = this.props
    
    const fee = Number(gasLevel.value * gas)

    const  Total = (assetAlias.value ==='BTM' ||assetId.value === btmID)?
      (Number(amount.value) + fee): amount.value
    return (
      <div>
        <h3>Confirm Transaction</h3>
        <div>
          <label>Asset: </label>
          <span>{assetAlias.value || assetId.value}</span>
        </div>

        <div>
          <label>To: </label>
          <span>{address.value}</span>
        </div>

        <div>
          <label>Amount: </label>
          <span>{amount.value}</span>
        </div>

        <div>
          <label>Fee: </label>
          <span>{fee}</span>
        </div>

        <div>
          <label>Total: </label>
          <span>{Total}</span>
        </div>



        <form onSubmit={handleSubmit}>
          <div>
            <label>{lang === 'zh' ? '密码' : 'Password'}</label>
            <PasswordField
              placeholder={lang === 'zh' ? '请输入密码' : 'Please enter the password'}
              fieldProps={password}
            />
          </div>
          <div>
            {/*<button type='button' onClick={previousPage}>*/}
              {/*<i/> Cancel*/}
            {/*</button>*/}
            <button type='submit'>
              Next <i/>
            </button>
          </div>
        </form>
      </div>
    )
  }
}

const validate = values => {
  const errors = {}
  if (!values.password) {
    errors.password = 'Required'
  }
  return errors
}


export default  reduxForm({
  form: 'NormalTransactionForm',
  fields:[
    'accountAlias',
    'accountId',
    'amount',
    'assetAlias',
    'assetId',
    'gasLevel',
    'address',
    'password'
  ],
  destroyOnUnmount: false,
  validate
})(ConfirmModal)