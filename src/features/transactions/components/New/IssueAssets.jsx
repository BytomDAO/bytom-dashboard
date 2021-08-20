import {
  BaseNew,
  FormSection,
  Autocomplete,
  ObjectSelectorField,
  TextField,
  AmountField,
  PasswordField,
  RadioField,
  KeyValueTable,
  GasField,
} from 'features/shared/components'
import { Connection } from 'sdk'
import {chainClient} from 'utility/environment'
import { addZeroToDecimalPosition } from 'utility/buildInOutDisplay'
import  TxContainer  from './NewTransactionsContainer/TxContainer'
import {reduxForm} from 'redux-form'
import React from 'react'
import styles from './New.scss'
import actions from 'actions'
import { btmID } from 'utility/environment'
import {getAssetDecimal, issueAssetTxActionBuilder} from '../../transactions'
import {withNamespaces} from 'react-i18next'


class IssueAssets extends React.Component {
  constructor(props) {
    super(props)
    this.connection = chainClient().connection
    this.state = {
      estimateGas:null,
      counter: 1,
    }

    this.submitWithValidation = this.submitWithValidation.bind(this)
    this.addReceiverItem = this.addReceiverItem.bind(this)
    this.removeReceiverItem = this.removeReceiverItem.bind(this)
  }

  submitWithValidation(data) {
    return new Promise((resolve, reject) => {
      this.props.submitForm(Object.assign({}, data, {state: this.state, form: 'issueAssetTx'}))
        .catch((err) => {
          const response = {}

          if (err.data) {
            response.actions = []
          }

          response['_error'] = err
          return reject(response)
        })
    })
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
    this.props.fields.receivers.removeField(index)
  }

  decodeRawTx(e){
    try {
      const rawTransaction = Connection.camelize(JSON.parse(e.target.value)).rawTransaction
      this.props.decode(rawTransaction)
    } catch (e) {
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.decodedTx.length !== 0 && nextProps.decodedTx !== this.props.decodedTx && nextProps.fields.submitAction.value === 'sign'){
      const transaction = nextProps.decodedTx

      const inputs = transaction.inputs
      const outputs = transaction.outputs

      const issueAction = inputs.filter(input => input.type === 'issue')[0]
      const issueAssetId = issueAction.assetId

      const issueReceivers = outputs.filter(output => output.assetId == issueAssetId)

      const diffLength = issueReceivers.length - this.props.fields.receivers.length

      if(diffLength > 0 ){
        const counter = this.state.counter
        for (let i = 0; i < diffLength; i++) {
          this.props.fields.receivers.addField({
            id: counter+i
          })
        }
        this.setState({
          counter: counter+diffLength,
        })
      }else if(diffLength < 0){
        for (let i = 0; i < -diffLength; i++) {
          this.removeReceiverItem(i)
        }
      }
    }

    else if( nextProps.fields.submitAction.value === 'submit' && this.props.fields.submitAction.value === 'sign'){
      const length = nextProps.fields.receivers.length
      if(length>1){
        for (let i = 0; i < (length-1) ; i++) {
          nextProps.fields.receivers.removeField(i)
        }
      }
    }

  }

  estimateNormalTransactionGas() {
    const transaction = this.props.fields
    const accountAlias = transaction.accountAlias.value
    const accountId = transaction.accountId.value
    const assetAlias = transaction.assetAlias.value
    const assetId = transaction.assetId.value
    const receivers = transaction.receivers
    const addresses = receivers.map(x => x.address.value)
    const amounts = receivers.map(x => Number(x.amount.value))

    const {t, i18n} = this.props

    const noAccount = !accountAlias && !accountId
    const noAsset = !assetAlias && !assetId

    if ( addresses.includes('') || amounts.includes(0)|| noAccount || noAsset) {
      this.setState({estimateGas: null})
      return
    }

    const actions = issueAssetTxActionBuilder(transaction, Math.pow(10, 7), 'amount.value' )

    const body = {actions, ttl: 1}
    this.connection.request('/build-transaction', body).then(resp => {
      if (resp.status === 'fail') {
        this.setState({estimateGas: null})
        const errorMsg =  resp.code && i18n.exists(`btmError.${resp.code}`) && t(`btmError.${resp.code}`) || resp.msg
        this.props.showError(new Error(errorMsg))
        return
      }

      return this.connection.request('/estimate-transaction-gas', {
        transactionTemplate: resp.data
      }).then(resp => {
        if (resp.status === 'fail') {
          this.setState({estimateGas: null})
          const errorMsg =  resp.code && i18n.exists(`btmError.${resp.code}`) && t(`btmError.${resp.code}`) || resp.msg
          this.props.showError(new Error(errorMsg))
          return
        }
        this.setState({estimateGas: Math.ceil(resp.data.totalNeu/100000)*100000})
      })
    })
  }

  render() {
    const {
      fields: {assetAlias, assetId, receivers, password, submitAction, signTransaction, accountId, accountAlias, gasLevel},
      error,
      handleSubmit,
      submitting
    } = this.props
    const t = this.props.t;
    [accountAlias, accountId, assetAlias, assetId].forEach(key => {
      key.onBlur = this.estimateNormalTransactionGas.bind(this)
    });
    (receivers.map(receiver => receiver.amount)).forEach(amount =>{
      amount.onBlur = this.estimateNormalTransactionGas.bind(this)
    })

    let submitLabel = t('transaction.new.submit')
    if (submitAction.value == 'sign') {
      submitLabel = t('transaction.issue.signTx')
    }

    let gas
    const options = [
      {label: t('transaction.advance.submitToBlockchain') , value: 'submit'},
      {label: t('transaction.issue.signRaw'), value: 'sign'}
    ]

    const showBtmAmountUnit = (assetAlias.value === 'BTM' || assetId.value === btmID)
    const assetDecimal = getAssetDecimal(this.props.fields, this.props.asset) || 0

    const asset = this.props.asset.filter(a => (a.id === assetId.value || a.alias === assetAlias.value))[0]

    let assetItem

    if (submitAction.value === 'sign' && this.props.decodedTx.length !== 0 && signTransaction.value && signTransaction.valid) {
      const transaction = this.props.decodedTx

      const inputs = transaction.inputs
      const outputs = transaction.outputs

      const issueAction = inputs.filter(input => input.type === 'issue')[0]
      const issueAssetId = issueAction.assetId
      assetId.value = issueAssetId

      gas = transaction.fee / Math.pow(10, 8) + ' BTM'

      accountAlias.value = inputs.filter(input => input.type === 'spend')[0].address

      const assetDefinition = issueAction.assetDefinition

      assetItem = <KeyValueTable
        title={t('form.assetDefinition')}
        id={issueAssetId}
        object='asset'
        items={[
          {label: 'ID', value: issueAssetId},
          {label: t('form.alias'), value: assetDefinition.name},
          {label: t('form.symbol'), value: assetDefinition.symbol},
          {label: t('form.decimals'), value: assetDefinition.decimals},
          {label: t('form.reissueTitle'), value: assetDefinition.reissue || 'true'},
          {label: t('form.quorum'), value: assetDefinition.quorum},
          {label: t('asset.additionInfo'), value: assetDefinition.description},
        ]}
      />

      const issueReceivers = outputs.filter(output => output.assetId == issueAssetId)

      receivers.map((receiver, index) =>{
        if(issueReceivers[index]){
          receiver.address.value = issueReceivers[index].address
          receiver.amount.value = addZeroToDecimalPosition((issueReceivers[index].amount/Math.pow(10, assetDefinition.decimals)), Number(assetDefinition.decimals))
        }
      })

    } else if (asset) {
      assetItem = <KeyValueTable
        title={t('form.assetDefinition')}
        id={asset.id}
        object='asset'
        items={[
          {label: 'ID', value: asset.id},
          {label: t('form.alias'), value: asset.alias},
          {label: t('form.symbol'), value: asset.definition.symbol},
          {label: t('form.decimals'), value: asset.definition.decimals},
          {label: t('form.reissueTitle'), value: (asset.alias === 'BTM' || asset.limitHeight > 0) ? 'false' : 'true'},
          {label: t('form.xpubs'), value: (asset.xpubs || []).length},
          {label: t('form.quorum'), value: asset.quorum},
          {label: t('asset.additionInfo'), value: asset.definition.description},
        ]}
      />
    }

    return (
      <TxContainer
        error={error}
        onSubmit={handleSubmit(this.submitWithValidation)}
        submitting={submitting}
        submitLabel= {submitLabel}
        className={styles.container}
      >

        <FormSection  title={t('transaction.issue.issueAsset')}>
          {assetItem}
          <label className={styles.title}>{t('form.input')}</label>
          <div className={styles.mainBox}>
            {
              submitAction.value === 'sign'?
                <TextField title={t('transaction.issue.accountAddress')}
                           disabled = {true}
                           fieldProps={accountAlias}/>
                :
                [
                  <ObjectSelectorField
                    key='asset-selector-field'
                    keyIndex='normaltx-asset'
                    title={ t('transaction.issue.issueAsset')}
                    aliasField={Autocomplete.AssetAlias}
                    fieldProps={{
                      id: assetId,
                      alias: assetAlias
                    }}
                  />,
                  <ObjectSelectorField
                    key='account-selector-field'
                    keyIndex='normaltx-account'
                    title={t('transaction.issue.gasAccount')}
                    aliasField={Autocomplete.AccountAlias}
                    fieldProps={{
                      id: accountId,
                      alias: accountAlias
                    }}
                  />
                ]
            }
          </div>
          <label className={styles.title}>{t('form.output')}</label>
          <div className={styles.mainBox}>
            {receivers.map((receiver, index) =>
              <div
                className={this.props.tutorialVisible? styles.tutorialItem: styles.subjectField}
                key={`issueAsset-${receiver.id.value}`}>
                <TextField title={t('form.address')}
                           disabled = {submitAction.value === 'sign'}
                           fieldProps={{
                             ...receiver.address,
                             onBlur: (e) => {
                               receiver.address.onBlur(e)
                             },
                           }}/>

                {
                  submitAction.value === 'sign'?
                    <TextField
                      title={t('form.amount')}
                      disabled = {true}
                      fieldProps={receiver.amount}
                    />:
                    <AmountField
                      isBTM={showBtmAmountUnit}
                      title={t('form.amount')}
                      fieldProps={receiver.amount}
                      decimal={assetDecimal}
                    />
                }

                <button
                  className={`btn btn-danger btn-large ${styles.deleteButton}`}
                  tabIndex='-1'
                  type='button'
                  disabled = {submitAction.value === 'sign'}
                  onClick={() => this.removeReceiverItem(index)}
                >
                  {t('commonWords.remove')}
                </button>
              </div>
            )}
            <button
              type='button'
              className='btn btn-default'
              disabled = {submitAction.value === 'sign'}
              onClick={this.addReceiverItem}
            >
              {t('commonWords.addField')}
            </button>
          </div>
        </FormSection>
        <FormSection  title= { 'Gas'}>

            {
              submitAction.value === 'sign'?
                gas || ''
                :
                <div className={styles.txFeeBox}>
                  <GasField
                    gas={this.state.estimateGas}
                    fieldProps={gasLevel}
                    btmAmountUnit={this.props.btmAmountUnit}
                  />
                  <span className={styles.feeDescription}></span>
                </div>
            }

        </FormSection>

        <FormSection  title= { t('transaction.issue.transactionType')}>
          <RadioField title={t('transaction.advance.buildType')} options={options} fieldProps={submitAction} />
          {
            submitAction.value === 'sign' &&
            <TextField
              title={t('transaction.advance.toSignTransaction')}
              fieldProps={{
                ...signTransaction,
                onBlur: (e) => {
                  signTransaction.onBlur(e)
                  this.decodeRawTx(e)
                },
              }}
            />
          }
        </FormSection>

        <FormSection  title={ t('key.password') }>
          <PasswordField
            placeholder={t('key.passwordPlaceholder')}
            fieldProps={password}
          />
        </FormSection>
      </TxContainer>

    )
  }
}

const validate = (values, props) => {
  const errors = {}
  const t = props.t

  // Base transaction
  let baseTx = (values.signTransaction || '').trim()
  try {
    JSON.parse(baseTx)
  } catch (e) {
    if (baseTx && e) {
      errors.signTransaction = t('errorMessage.jsonError')
    }
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
  ...BaseNew.mapDispatchToProps('transaction')(dispatch),
  decode: (transaction) => dispatch( actions.transaction.decode(transaction)),
  showError: err => dispatch({type: 'ERROR', payload: err}),
})

const mapStateToProps = (state, ownProps) => {
  return {
    ...BaseNew.mapStateToProps('transaction')(state, ownProps),
    decodedTx: state.transaction.decodedTx,
    initialValues:{
      assetAlias: ownProps.location.query.alias,
      accountAlias: ownProps.location.query.accountAlias || state.account.currentAccount,
      assetId:'',
      submitAction: 'submit',
      gasLevel: '1',
      receivers:[{
        id: 0,
        amount:'',
        address:''
      }]
    }
}}

export default withNamespaces('translations') (BaseNew.connect(
  mapStateToProps,
  mapDispatchToProps,
  reduxForm({
    form: 'IssueAssetTxForm',
    fields: [
      'assetAlias',
      'assetId',
      'receivers[].id',
      'receivers[].amount',
      'receivers[].address',
      'password',
      'submitAction',
      'signTransaction',
      'accountAlias',
      'accountId',
      'gasLevel'
    ],
    asyncValidate,
    asyncBlurFields: ['receivers[].address'],
    validate,
    touchOnChange: true,
  }
  )(IssueAssets)
))
