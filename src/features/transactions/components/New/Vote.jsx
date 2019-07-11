import {
  BaseNew,
  TextField,
  Autocomplete,
  ObjectSelectorField,
  AmountUnitField,
  GasField,
  RadioField
} from 'features/shared/components'
import {chainClient} from 'utility/environment'
import {reduxForm} from 'redux-form'
import React from 'react'
import styles from './New.scss'
import  TxContainer  from './NewTransactionsContainer/TxContainer'
import actions from 'actions'
import VoteConfirmModal from './VoteConfirmModal/VoteConfirmModal'
import { voteTxActionBuilder} from '../../transactions'
import {withNamespaces} from 'react-i18next'

class Vote extends React.Component {
  constructor(props) {
    super(props)
    this.connection = chainClient().connection
    this.state = {
      estimateGas:null,
      address:null
    }

    this.submitWithValidation = this.submitWithValidation.bind(this)
    this.disableSubmit = this.disableSubmit.bind(this)
  }

  disableSubmit() {
    return !(this.state.estimateGas)
  }

  submitWithValidation(data) {
    return new Promise((resolve, reject) => {
      this.props.submitForm(Object.assign({}, data, {state: this.state, form: 'voteTx'}))
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

  confirmedTransaction(e){
    e.preventDefault()
    this.props.showModal(
      <VoteConfirmModal
        cancel={this.props.closeModal}
        onSubmit={this.submitWithValidation}
        gas={this.state.estimateGas}
        btmAmountUnit={this.props.btmAmountUnit}
      />
    )
  }

  estimateNormalTransactionGas() {
    const transaction = this.props.fields
    const accountAlias = transaction.accountAlias.value
    const accountId = transaction.accountId.value
    const nodePubkey = transaction.nodePubkey.value
    const amount = Number(transaction.amount.value)

    const {t, i18n} = this.props

    const noAccount = !accountAlias && !accountId

    if ( nodePubkey === '' || amount === 0|| noAccount ) {
      this.setState({estimateGas: null})
      return
    }


    this.props.getAddress({accountAlias, accountId}).then(address => {
      this.setState({address})
      const actions = voteTxActionBuilder(transaction, Math.pow(10, 7), address)

      return this.props.buildTransaction({actions, ttl: 1}).then(tmp => {
        return this.props.estimateGasFee(tmp.data).then(resp => {
          this.setState({estimateGas: Math.ceil(resp.data.totalNeu/100000)*100000})
        }).catch(err =>{
          throw err
        })
      }).catch(err =>{
        throw err
      })
    }).catch(err =>{
      this.setState({estimateGas: null, address: null})
      const errorMsg =  err.code && i18n.exists(`btmError.${err.code}`) && t(`btmError.${err.code}`) || err.msg
      this.props.showError(new Error(errorMsg))
    })

  }

  render() {
    const {
      fields: {action, accountId, accountAlias, nodePubkey, amount, gasLevel},
      error,
      submitting
    } = this.props
    const t = this.props.t;
    [accountAlias, accountId,nodePubkey, amount].forEach(key => {
      key.onBlur = this.estimateNormalTransactionGas.bind(this)
    });

    let submitLabel = t(`transaction.vote.${action.value}.submit`)

    const options = [
      {label:t('transaction.vote.vote.title'), value: 'vote'},
      {label:t('transaction.vote.veto.title'), value: 'veto'}
    ]

    return (
          <TxContainer
            error={error}
            onSubmit={(e)=>this.confirmedTransaction(e)}
            submitting={submitting}
            submitLabel= {submitLabel}
            disabled={this.disableSubmit()}
            className={styles.container}
          >
          <div className={styles.borderBottom}>
            <label className={styles.title}>{t('transaction.vote.info')}</label>
            <div className={`${styles.mainBox} `}>
              <RadioField title={t('transaction.vote.action')} options={options} fieldProps={action} />
              <ObjectSelectorField
                key='account-selector-field'
                keyIndex='votetx-account'
                title={t('form.account')}
                aliasField={Autocomplete.AccountAlias}
                fieldProps={{
                  id: accountId,
                  alias: accountAlias
                }}
                disabled
              />
              <div>
                <TextField
                  key='asset-selector-field'
                  keyIndex='votetx-nodePubkey'
                  title={ t('form.vote')}
                  fieldProps={nodePubkey}
                />
              </div>
              <div>
                <AmountUnitField
                  key='asset-selector-field'
                  keyIndex='votetx-amount'
                  title={ t(`transaction.vote.${action.value}.voteAmount`)}
                  fieldProps={amount}
                />
              </div>
            </div>


            <label className={styles.title}>{t('transaction.normal.selectFee')}</label>
            <div className={styles.txFeeBox}>
              <GasField
                gas={this.state.estimateGas}
                fieldProps={gasLevel}
                btmAmountUnit={this.props.btmAmountUnit}
              />
              <span className={styles.feeDescription}> {t('transaction.normal.feeDescription')}</span>
            </div>
          </div>
        </TxContainer>
    )
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
  getAddress: actions.transaction.getAddresses,
  estimateGasFee: actions.transaction.estimateGas,
  buildTransaction: actions.transaction.buildTransaction,
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
        action: 'vote'
      }
    }
  }
  return {}
}

export default withNamespaces('translations') (BaseNew.connect(
  BaseNew.mapStateToProps('transaction'),
  mapDispatchToProps,
  reduxForm({
    form: 'Vote',
    fields: [
      'action',
      'accountAlias',
      'accountId',
      'nodePubkey',
      'amount',
      'gasLevel',
    ],
    validate,
    touchOnChange: true
  }, initialValues)(Vote)
))
