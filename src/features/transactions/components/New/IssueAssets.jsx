import {
  BaseNew,
  FormSection,
  Autocomplete,
  SubmitIndicator,
  ObjectSelectorField,
  ErrorBanner,
  TextField,
  AmountInputMask,
  AmountUnitField,
  PasswordField,
  RadioField,
  KeyValueTable,
} from 'features/shared/components'
import { Connection } from 'sdk'
import {chainClient} from 'utility/environment'
import { addZeroToDecimalPosition } from 'utility/buildInOutDisplay'
import {reduxForm} from 'redux-form'
import React from 'react'
import styles from './New.scss'
import disableAutocomplete from 'utility/disableAutocomplete'
import actions from 'actions'
import { btmID } from 'utility/environment'
import { getAssetDecimal} from '../../transactions'
import {withNamespaces} from 'react-i18next'


class IssueAssets extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      counter: 1
    }

    this.submitWithValidation = this.submitWithValidation.bind(this)
    // this.disableSubmit = this.disableSubmit.bind(this)
    this.addReceiverItem = this.addReceiverItem.bind(this)
  }

  // disableSubmit(actions) {
  //   return actions.length == 0 && !this.state.showAdvanced
  // }

  submitWithValidation(data) {
    return new Promise((resolve, reject) => {
      this.props.submitForm(Object.assign({}, data, {state: this.state, form: 'issueAssetTx'}))
        .catch((err) => {
          const response = {}

          if (err.data) {
            response.actions = []

            // err.data.forEach((error) => {
            //   response.actions[error.data.actionIndex] = {type: error}
            // })
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

  render() {
    const {
      fields: {assetAlias, assetId, receivers, password, submitAction, signTransaction, accountId, accountAlias, gas},
      error,
      handleSubmit,
      submitting
    } = this.props
    const t = this.props.t

    let submitLabel = t('transaction.new.submit')
    // const hasBaseTransaction = ((signTransaction.value || '').trim()).length > 0
    // if (submitAction.value == 'generate' && !hasBaseTransaction) {
    //   submitLabel = t('transaction.advance.generateJson')
    // }

    const options = [
      {label: t('transaction.advance.submitToBlockchain') , value: 'submit'},
      {label: 'sign raw transaction', value: 'sign'}
    ]
    const showBtmAmountUnit = (assetAlias.value === 'BTM' || assetId.value === btmID)
    const assetDecimal = getAssetDecimal(this.props.fields, this.props.asset) || 0

    const asset = this.props.asset.filter(a => (a.id === assetId.value || a.alias === assetAlias.value))[0]

    let assetItem
    if(submitAction.value === 'sign' && this.props.decodedTx.length != 0 && signTransaction.value){
      const transaction = this.props.decodedTx

      const inputs = transaction.inputs
      const outputs = transaction.outputs

      const issueAction = inputs.filter(input => input.type=='issue')[0]
      const issueAssetId = issueAction.assetId
      assetId.value = issueAssetId

      gas.value = transaction.fee/Math.pow(10, 8) + ' BTM'

      accountAlias.value = inputs.filter(input => input.type=='spend')[0].address

      const assetDefinition = issueAction.assetDefinition

      assetItem = <KeyValueTable
        title={'definition'}
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
        receiver.address.value = issueReceivers[index].address
        receiver.amount.value = addZeroToDecimalPosition((issueReceivers[index].amount/Math.pow(10, assetDefinition.decimals)), Number(assetDefinition.decimals))
      })

    }else if(asset){
      assetItem = <KeyValueTable
        title={'definition'}
        id={asset.id}
        object='asset'
        items={[
          {label: 'ID', value: asset.id},
          {label: t('form.alias'), value: asset.alias},
          {label: t('form.symbol'), value: asset.definition.symbol},
          {label: t('form.decimals'), value: asset.definition.decimals},
          {label: t('form.reissueTitle'), value: (asset.alias === 'BTM' || asset.limitHeight > 0)? 'false': 'true'},
          {label: t('form.xpubs'), value: (asset.xpubs || []).length},
          {label: t('form.quorum'), value: asset.quorum},
          {label: t('asset.additionInfo'), value: asset.definition.description},
        ]}
      />
    }

    return (
      <form
        className={styles.container}
        onSubmit={handleSubmit(this.submitWithValidation)} {...disableAutocomplete}
      >

        <FormSection  title= { 'Issue asset'}>
        {/*<FormSection>*/}
          <div>
            {/*<label>definition</label>*/}
             {assetItem}
            <ObjectSelectorField
              key='asset-selector-field'
              keyIndex='normaltx-asset'
              title={ t('form.asset')}
              aliasField={Autocomplete.AssetAlias}
              disabled = {submitAction.value === 'sign'}
              selected = {submitAction.value === 'sign'? 'ID':'Alias'}
              fieldProps={{
                id: assetId,
                alias: assetAlias
              }}
            />
          </div>
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
                    <div>
                      {
                        showBtmAmountUnit ?
                          <AmountUnitField title={t('form.amount')}
                          fieldProps={receiver.amount}
                          />
                          :
                          <AmountInputMask title={t('form.amount')}
                                           fieldProps={receiver.amount}
                                           decimal={assetDecimal}
                          />
                      }
                    </div>
                }

                <button
                  className={`btn btn-danger btn-xs ${styles.deleteButton}`}
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
                <div className={styles.item}>
                    <TextField title={t('form.address')}
                           disabled = {true}
                           fieldProps={accountAlias}/>
                  <TextField title={'gas'}
                           disabled = {true}
                           fieldProps={gas}/>
                </div>
                :
                <div className={styles.item}>
                  <ObjectSelectorField
                    key='account-selector-field'
                    keyIndex='normaltx-account'
                    title={t('form.account')}
                    aliasField={Autocomplete.AccountAlias}
                    fieldProps={{
                      id: accountId,
                      alias: accountAlias
                    }}
                  />
                <AmountUnitField title={'gas'} fieldProps={gas}/>
              </div>
            }

        </FormSection>

        <FormSection  title= { 'transaction'}>
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
            // title={t('key.password')}
            placeholder={t('key.passwordPlaceholder')}
            fieldProps={password}
          />
        </FormSection>

        <FormSection >
          {error &&
          <ErrorBanner
            title={t('form.errorTitle')}
            error={error} />}

          <div className={styles.submit}>
            <button type='submit' className='btn btn-primary' disabled={submitting || this.disableSubmit(actions)}>
              {submitLabel ||  t('form.submit')}
            </button>

            { submitting &&
            <SubmitIndicator />
            }
          </div>
        </FormSection>
      </form>
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
})

const mapStateToProps = (state, ownProps) => ({
  ...BaseNew.mapStateToProps('transaction')(state, ownProps),
  decodedTx: state.transaction.decodedTx
})

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
      'gas'
    ],
    asyncValidate,
    asyncBlurFields: ['receivers[].address'],
    validate,
    touchOnChange: true,
    initialValues: {
      submitAction: 'submit',
      receivers:[{
        id: 0,
        amount:'',
        address:''
      }]
    },
  }
  )(IssueAssets)
))
