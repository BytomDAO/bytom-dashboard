import React, { Component } from 'react'
import {reduxForm} from 'redux-form'
import {
  PasswordField,
  ErrorBanner,
  SubmitIndicator
} from 'features/shared/components'
import { btmID } from 'utility/environment'
import { normalizeBTMAmountUnit, converIntToDec } from 'utility/buildInOutDisplay'
import styles from './ConfirmModal.scss'
import { Link } from 'react-router'


class ConfirmModal extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      fields: { accountId, accountAlias, assetId, assetAlias, address, amount, password, gasLevel },
      handleSubmit,
      submitting,
      cancel,
      error,
      gas,
      lang,
      btmAmountUnit,
      assetDecimal
    } = this.props

    const fee = Number(gasLevel.value * gas)

    const  Total = (assetAlias.value ==='BTM' ||assetId.value === btmID)?
      (Number(amount.value) + fee): amount.value

    let submitLabel = lang === 'zh' ? '提交交易' : 'Submit transaction'

    const normalize = (value, asset) => {
      if (asset === btmID || asset === 'BTM'){
        return normalizeBTMAmountUnit(btmID, value, btmAmountUnit)
      }else if( assetDecimal ){
        return converIntToDec(value, assetDecimal)
      }else{
        return value
      }
    }

    const asset = assetAlias.value || (this.props.asset.find(i => i.id === assetId.value)).alias || assetId.value
    const assetIdLink = assetId.value || (this.props.asset.find(i => i.alias === assetAlias.value)).id

    const unit =  <Link to={`/assets/${assetIdLink}`}  className={styles.unit} target='_blank'>
        {(asset !== btmID && asset !== 'BTM') && asset}
      </Link>

    return (
      <div>
        <h3>{lang ==='zh'?'确认交易':'Confirm Transaction'}</h3>
        <table className={styles.table}>
          <tbody>
            <tr>
              <td className={styles.colLabel}>From</td>
              <td> <span>{accountAlias.value || accountId.value}</span></td>
            </tr>

            <tr>
              <td className={styles.colLabel}>To</td>
              <td> <span>{address.value}</span> </td>
            </tr>

            <tr>
              <td className={styles.colLabel}>{lang === 'zh'? '数量':'Amount'}</td>
              <td> <code>{normalize(amount.value, asset)} {unit}</code> </td>
            </tr>

            <tr>
              <td className={styles.colLabel}>{lang === 'zh'?'手续费':'Fee'}</td>
              <td> <code>{normalizeBTMAmountUnit(btmID, fee, btmAmountUnit)}</code> </td>
            </tr>

            <tr>
              <td className={styles.colLabel}>{lang === 'zh'? '交易总数' :'Total'}</td>
              <td> <code>{normalize(Total, asset)} {unit}</code> </td>
            </tr>
          </tbody>
        </table>

        <hr className={styles.hr}/>

        <form onSubmit={handleSubmit}>
          <div>
            <label>{lang === 'zh' ? '密码' : 'Password'}</label>
            <PasswordField
              placeholder={lang === 'zh' ? '请输入密码' : 'Please enter the password'}
              fieldProps={password}
            />
          </div>

          {error && error.message === 'PasswordWrong' &&
          <ErrorBanner
            title='Error submitting form'
            error='Your password is wrong, please check your password.' />}

          <div className={styles.btnGroup}>
            <div>
              <button type='submit' className='btn btn-primary'
                      disabled={submitting}>
                {submitLabel}
              </button>

              {submitting &&
              <SubmitIndicator className={styles.submitIndicator} />
              }
            </div>
            <button type='button'  className='btn btn-default' onClick={cancel}>
              <i/> {lang ==='zh'? '返回' :'Cancel'}
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