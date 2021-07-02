import React, { Component } from 'react'
import { reduxForm } from 'redux-form'
import { PasswordField, ErrorBanner, SubmitIndicator } from 'features/shared/components'
import { btmID } from 'utility/environment'
import { sum } from 'utility/math'
import { normalizeBTMAmountUnit, converIntToDec } from 'utility/buildInOutDisplay'
import styles from './ConfirmModal.scss'
import { Link } from 'react-router'
import { withNamespaces } from 'react-i18next'

class ConfirmModal extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      fields: { accountId, accountAlias, assetId, assetAlias, receivers, password, gasLevel },
      handleSubmit,
      submitting,
      cancel,
      error,
      gas,
      t,
      btmAmountUnit,
      assetDecimal,
    } = this.props

    const fee = Number(gasLevel.value * gas)

    const totalAmount = sum(receivers, 'amount.value')

    const Total = assetAlias.value === 'BTM' || assetId.value === btmID ? totalAmount + fee : totalAmount

    let submitLabel = t('transaction.new.submit')

    const normalize = (value, asset) => {
      if (asset === btmID || asset === 'BTM') {
        return normalizeBTMAmountUnit(btmID, value, btmAmountUnit)
      } else if (assetDecimal) {
        return converIntToDec(value, assetDecimal)
      } else {
        return value
      }
    }

    const findAssetById = assetId.value && this.props.asset.find((i) => i.id === assetId.value)
    const findAssetByAlias = assetAlias.value && this.props.asset.find((i) => i.alias === assetAlias.value)

    const asset = assetAlias.value || (findAssetById && findAssetById.alias) || assetId.value
    const assetIdLink = assetId.value || (findAssetByAlias && findAssetByAlias.id)

    const unit =
      asset !== btmID && asset !== 'BTM' ? (
        <Link to={`/assets/${assetIdLink}`} className={styles.unit} target="_blank">
          {asset}
        </Link>
      ) : null

    return (
      <div>
        <h3>{t('transaction.normal.confirmation')}</h3>
        <table className={styles.table}>
          <tbody>
            <tr>
              <td className={styles.colLabel}>From</td>
              <td className={styles.colValue}>
                {' '}
                <span>{accountAlias.value || accountId.value}</span>
              </td>
            </tr>
            <tr>
              <td></td>
            </tr>

            {receivers.map((receiver) => [
              <tr>
                <td className={styles.colLabel}>To</td>
                <td className={styles.colValue}>
                  {' '}
                  <span>{receiver.address.value}</span>{' '}
                </td>
              </tr>,
              <tr>
                <td className={styles.colLabel}>{t('form.amount')}</td>
                <td className={styles.colValue}>
                  {normalize(receiver.amount.value, asset)} {unit}
                </td>
              </tr>,
              <tr>
                <td></td>
              </tr>,
            ])}

            <tr>
              <td className={styles.colLabel}>{t('form.fee')}</td>
              <td className={styles.colValue}>
                {normalizeBTMAmountUnit(btmID, fee, btmAmountUnit)}
              </td>
            </tr>

            <tr>
              <td className={styles.colLabel}>{t('transaction.normal.total')}</td>
              <td className={styles.colValue}>
                {normalize(Total, asset)} {unit}
              </td>
            </tr>
          </tbody>
        </table>

        <hr className={styles.hr} />

        <form onSubmit={handleSubmit}>
          <div>
            <label>{t('key.password')}</label>
            <PasswordField placeholder={t('key.passwordPlaceholder')} fieldProps={password} />
          </div>

          {error && error.message === 'PasswordWrong' && (
            <ErrorBanner title={t('form.errorTitle')} error={t('errorMessage.password')} />
          )}

          <div className={styles.btnGroup}>
            <div>
              <button type="submit" className="btn btn-primary btn-large" disabled={submitting}>
                {submitLabel}
              </button>

              {submitting && <SubmitIndicator className={styles.submitIndicator} />}
            </div>
            <button type="button" className="btn btn-default btn-large" onClick={cancel}>
              <i /> {t('form.cancel')}
            </button>
          </div>
        </form>
      </div>
    )
  }
}

const validate = (values) => {
  const errors = {}
  if (!values.password) {
    errors.password = 'Required'
  }
  return errors
}

export default withNamespaces('translations')(
  reduxForm({
    form: 'NormalTransactionForm',
    fields: [
      'accountAlias',
      'accountId',
      'assetAlias',
      'assetId',
      'receivers[].amount',
      'receivers[].address',
      'gasLevel',
      'isChainTx',
      'password',
    ],
    destroyOnUnmount: false,
    validate,
  })(ConfirmModal),
)
