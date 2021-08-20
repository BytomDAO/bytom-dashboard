import {
  BaseNew,
  TextField,
  Autocomplete,
  ObjectSelectorField,
  AmountField,
  GasField
} from 'features/shared/components'
import {reduxForm} from 'redux-form'
import React from 'react'
import styles from './New.scss'
import  TxContainer  from './NewTransactionsContainer/TxContainer'
import { btmID } from 'utility/environment'
import actions from 'actions'
import {chainClient} from 'utility/environment'
import ConfirmModal from './ConfirmModal/ConfirmModal'
import { balance , getAssetDecimal} from '../../transactions'
import {withNamespaces} from 'react-i18next'

class NormalTxForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      estimateGas:1000000,
      counter: 1,
      displayGas: true
    }

    this.submitWithValidation = this.submitWithValidation.bind(this)
    this.addReceiverItem = this.addReceiverItem.bind(this)
    this.disableSubmit = this.disableSubmit.bind(this)
  }

  disableSubmit() {
    const {
      values: {assetId, assetAlias, receivers},
    } = this.props

    const noAsset = !assetAlias && !assetId
    const addresses = receivers.map(x => x.address)
    const amounts = receivers.map(x => Number(x.amount))

    const invalids = this.props.fields.receivers.map(x => x.address.invalid)

    return ( addresses.includes('') || amounts.includes(0) || invalids.includes(true) || noAsset)
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

    promise.then(() => {})
  }

  render() {
    const {
      fields: {accountId, accountAlias, assetId, assetAlias, receivers, gasLevel, isChainTx},
      error,
      submitting
    } = this.props
    const t = this.props.t;

    let submitLabel = t('transaction.new.submit')

    const assetDecimal = getAssetDecimal(this.props.fields, this.props.asset) || 0

    const showAvailableBalance = (accountAlias.value || accountId.value) &&
      (assetAlias.value || assetId.value)

    const availableBalance = balance(this.props.fields, assetDecimal, this.props.balances, this.props.btmAmountUnit)

    const isBTM = (assetAlias.value === 'BTM' || assetId.value === btmID)

    return <TxContainer
      error={error}
      onSubmit={e => this.confirmedTransaction(e, assetDecimal)}
      submitting={submitting}
      submitLabel={submitLabel}
      disabled={this.disableSubmit()}
      className={styles.container}
    >
      <div className={styles.borderBottom}>
        <label className={styles.title}>{t('transaction.normal.from')}</label>
        <div className={`${styles.mainBox} `} style={{ width: '560px' }}>
          <ObjectSelectorField
            key='account-selector-field'
            keyIndex='normaltx-account'
            title={t('form.account')}
            aliasField={Autocomplete.AccountAlias}
            fieldProps={{
              id: accountId,
              alias: accountAlias
            }}
            disabled
          />
          <div>
            <ObjectSelectorField
              key='asset-selector-field'
              keyIndex='normaltx-asset'
              title={t('form.asset')}
              aliasField={Autocomplete.AssetAlias}
              fieldProps={{
                id: assetId,
                alias: assetAlias
              }}
            />
            {showAvailableBalance && availableBalance &&
            <small className={styles.balanceHint}>{t('transaction.normal.availableBalance')} {availableBalance}</small>}
          </div>
        </div>

        <label className={styles.title}>{t('transaction.normal.to')}</label>

        <div className={styles.mainBox}>
          {receivers.map((receiver, index) =>
            <div
              className={styles.subjectField}
              key={receiver.id.value}>
              <TextField title={t('form.address')} fieldProps={{
                ...receiver.address
              }}/>

              <AmountField
                isBTM={isBTM}
                title={t('form.amount')}
                fieldProps={receiver.amount}
                decimal={assetDecimal}
              />

              <button
                className={`btn btn-danger btn-large ${styles.deleteButton}`}
                tabIndex='-1'
                type='button'
                onClick={() => this.removeReceiverItem(index)}
              >
                {t('commonWords.remove')}
              </button>
            </div>
          )}
          <button
            type='button'
            className='btn btn-default btn-large'
            onClick={this.addReceiverItem}
          >
            {t('commonWords.addField')}
          </button>
        </div>

        {isBTM && [<label className={styles.title}>{t('transaction.new.submitType')}</label>,
          <div className={styles.submitSwitchSet}>
            <div className={styles.submitSwitch}>
              <div className={styles.label}>{t('transaction.new.chainTx')}</div>
              <label className={styles.switch}>
                <input
                  type='checkbox'
                  {...isChainTx}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            <div>{t('transaction.new.chainTxNote')}</div>
          </div>]}

        { this.state.displayGas &&
          [<label className={styles.title}>{t('transaction.normal.selectFee')}</label>,
            <div className={styles.txFeeBox}>
              <GasField
                gas={this.state.estimateGas}
                fieldProps={gasLevel}
                btmAmountUnit={this.props.btmAmountUnit}
              />
              <span className={styles.feeDescription}></span>
            </div>]}
      </div>
    </TxContainer>
  }
}

const validate = (values, props) => {
  const errors = {gas: {}}
  const t = props.t

  // Numerical
  if (values.amount && !/^\d+(\.\d+)?$/i.test(values.amount)) {
    errors.amount = ( t('errorMessage.amountError') )
  }
  return errors
}

const asyncValidate = (values, dispatch, props) => {
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
                errors[idx] = {address: props.t('errorMessage.addressError')}
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

const initialValues = (state, ownProps) => {
  const account = state.account.currentAccount
  if (account) {
    return {
      initialValues: {
        accountAlias: account,
        accountId:'',
        gasLevel: '1',
        receivers:[{
          id: 0,
          amount:'',
          address:''
        }]
      }
    }
  }
  return {}
}

export default withNamespaces('translations') (BaseNew.connect(
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
      'isChainTx'
    ],
    asyncValidate,
    asyncBlurFields: ['receivers[].address'],
    validate,
    touchOnChange: true
  }, initialValues)(NormalTxForm)
))
