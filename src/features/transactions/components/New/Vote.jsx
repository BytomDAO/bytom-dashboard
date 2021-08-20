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
      estimateGas:1000000,
      address:null,
      displayGas: true
    }

    this.submitWithValidation = this.submitWithValidation.bind(this)
    this.disableSubmit = this.disableSubmit.bind(this)
  }

  disableSubmit() {
    const {
      values: {nodePubkey, amount}
    } = this.props

    return ( !nodePubkey || !amount )
  }

  submitWithValidation(data) {
    return new Promise((resolve, reject) => {
      this.props.getAddress({accountAlias:data.accountAlias, accountId:data.accountId}).then(address => {
        this.setState({address},()=>{
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

  render() {
    const {
      fields: {action, accountId, accountAlias, nodePubkey, amount, gasLevel, isChainTx},
      error,
      submitting
    } = this.props
    const t = this.props.t

    let submitLabel = t(`transaction.vote.${action.value}.submit`)

    const options = [
      {label:t('transaction.vote.vote.title'), value: 'vote'},
      {label:t('transaction.vote.veto.title'), value: 'veto'}
    ]

    return <TxContainer
      error={error}
      onSubmit={(e) => this.confirmedTransaction(e)}
      submitting={submitting}
      submitLabel={submitLabel}
      disabled={this.disableSubmit()}
      className={styles.container}
    >
      <div className={styles.borderBottom}>
        <label className={styles.title}>{t('transaction.vote.info')}</label>
        <div className={`${styles.mainBox} `}>
          <RadioField title={t('transaction.vote.action')} options={options} fieldProps={action}/>
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
              title={t('form.vote')}
              fieldProps={nodePubkey}
            />
          </div>
          <div>
            <AmountUnitField
              key='asset-selector-field'
              keyIndex='votetx-amount'
              title={t(`transaction.vote.${action.value}.voteAmount`)}
              fieldProps={amount}
            />
          </div>
        </div>

        <label className={styles.title}>{t('transaction.new.submitType')}</label>
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
        </div>

        {this.state.displayGas && [<label className={styles.title}>{t('transaction.normal.selectFee')}</label>,
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
      'isChainTx'
    ],
    validate,
    touchOnChange: true
  }, initialValues)(Vote)
))
