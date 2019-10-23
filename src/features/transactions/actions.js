import uuid from 'uuid'
import {chainClient, btmID} from 'utility/environment'
import {parseNonblankJSON} from 'utility/string'
import {push} from 'react-router-redux'
import {baseCreateActions, baseListActions} from 'features/shared/actions'
import { voteTxActionBuilder, normalTxActionBuilder, issueAssetTxActionBuilder, crossChainTxActionBuilder } from './transactions'

const type = 'transaction'

const list = baseListActions(type, {
  defaultKey: 'id'
})

const form = baseCreateActions(type)

function preprocessTransaction(formParams) {
  const copy = JSON.parse(JSON.stringify(formParams))
  const builder = {
    baseTransaction: copy.baseTransaction,
    actions: copy.actions || [],
  }

  if (formParams.form === 'normalTx') {
    const gasPrice = formParams.state.estimateGas * Number(formParams.gasLevel)
    builder.actions = normalTxActionBuilder(formParams,  Number(gasPrice), 'amount')
  }

  if (formParams.form === 'crossChainTx') {
    const gasPrice = formParams.state.estimateGas * Number(formParams.gasLevel)
    builder.actions = crossChainTxActionBuilder(formParams,  Number(gasPrice))
  }

  if (formParams.form === 'voteTx') {
    const gasPrice = formParams.state.estimateGas * Number(formParams.gasLevel)
    builder.actions = voteTxActionBuilder(formParams,  Number(gasPrice), formParams.state.address)
  }

  if (formParams.form === 'issueAssetTx') {
    const gasPrice = formParams.state.estimateGas * Number(formParams.gasLevel)
    builder.actions = issueAssetTxActionBuilder(formParams, Number(gasPrice), 'amount')
  }


  if (builder.baseTransaction == '') {
    delete builder.baseTransaction
  }

  if (formParams.submitAction == 'generate') {
    builder.ttl = '1h' // 1 hour
  }

  for (let i in builder.actions) {
    let a = builder.actions[i]

    delete a.ID
    const intFields = ['amount', 'position','sourcePos','vmVersion']
    intFields.forEach(key => {
      const value = a[key]
      if (value) {
        if ((parseInt(value) + '') == value) {
          a[key] = parseInt(value)
        } else {
          throw new Error(`Action ${parseInt(i) + 1} ${key} must be an integer.`)
        }
      }
    })

    try {
      a.referenceData = parseNonblankJSON(a.referenceData)
    } catch (err) {
      throw new Error(`Action ${parseInt(i) + 1} reference data should be valid JSON, or blank.`)
    }

    try {
      a.receiver = parseNonblankJSON(a.receiver)
    } catch (err) {
      throw new Error(`Action ${parseInt(i) + 1} receiver should be valid JSON.`)
    }
  }
  return builder
}

form.submitForm = (formParams) => function (dispatch) {
  const client = chainClient()

  const builderFunction = ( builder ) => {
    const processed = preprocessTransaction(formParams)

    builder.actions = processed.actions
    if (processed.baseTransaction) {
      builder.baseTransaction = processed.baseTransaction
    }
  }

  const submitSucceeded = () => {
    dispatch(form.created())
    dispatch(push({
      pathname: '/transactions',
      state: {
        preserveFlash: true
      }
    }))
  }

  // normal transactions
  if( formParams.form === 'normalTx' || formParams.form === 'voteTx' || formParams.form === 'crossChainTx'){

    const accountId = formParams.accountId
    const accountAlias = formParams.accountAlias
    const accountInfo = Object.assign({},  accountAlias!== ''? {alias: accountAlias}: {id: accountId})

    const isChainTx = formParams.isChainTx
    const isBTM = ((formParams.assetId === btmID) || (formParams.assetAlias === 'BTM')||(formParams.form === 'voteTx'))

    return client.accounts.query(accountInfo)
      .then( resp => {
        if(resp.data[0].xpubs.length > 1){
          throw {code: 'F_BTM003'}
        }
        const body = Object.assign({}, {xpub: resp.data[0].xpubs[0], password: formParams.password})
        return client.mockHsm.keys.checkPassword(body)
      })
      .then( result => {
        if(!result.data.checkResult){
          throw new Error('PasswordWrong')
        }

        if(isChainTx && isBTM)
          return client.transactions.buildChain(builderFunction)
        else
          return client.transactions.build(builderFunction)
      })
      .then( tpl => {

        if(isChainTx && isBTM){
          const body = Object.assign({}, {password: formParams.password, transactions: tpl.data})
          return client.transactions.signBatch(body)
        }
        else{
          const body = Object.assign({}, {password: formParams.password, transaction: tpl.data})
          return client.transactions.sign(body)
        }
      })
      .then(signed => {
        if(!signed.data.signComplete){
          throw {code: 'F_BTM100'}
        }

        if(isChainTx && isBTM){
          const rawTransactions = signed.data.transaction.map(tx => tx.rawTransaction)
          return client.transactions.submitBatch(rawTransactions)
        }
        else{
          return client.transactions.submit(signed.data.transaction.rawTransaction)
        }
      })
      .then(submitSucceeded)
  }

  //advanced transactions
  else if( formParams.form === 'advancedTx' ){
    const buildPromise = (formParams.state.showAdvanced && formParams.signTransaction) ? null :
      client.transactions.build(builderFunction)

    if (formParams.submitAction == 'submit') {
      const signAndSubmitTransaction = (transaction) => {
        const body = Object.assign({}, {password: formParams.password, transaction: transaction})
        return client.transactions.sign(body)
          .then( signed => client.transactions.submit(signed.data.transaction.rawTransaction) )
          .then(submitSucceeded)
      }

      if( formParams.state.showAdvanced
        && formParams.signTransaction ){
        const transaction = JSON.parse(formParams.signTransaction)
        return signAndSubmitTransaction(transaction)
      }

      return buildPromise
        .then(tpl => signAndSubmitTransaction(tpl.data))
    }

    // submitAction == 'generate'
    const signAndSubmitGeneratedTransaction = (transaction) => {
      const body = Object.assign({}, {password: formParams.password, transaction: transaction})
      return client.transactions.sign(body)
        .then(resp => {
          const id = uuid.v4()
          dispatch({
            type: 'GENERATED_TX_HEX',
            generated: {
              id: id,
              hex: JSON.stringify(resp.data.transaction),
            },
          })
          dispatch(push(`/transactions/generated/${id}`))
        })
    }

    if (formParams.state.showAdvanced
      && formParams.signTransaction) {
      const transaction = JSON.parse(formParams.signTransaction)
      return signAndSubmitGeneratedTransaction(transaction)
    }

    return buildPromise
      .then(resp => signAndSubmitGeneratedTransaction(resp.data))
  }

  //issue Asset transactions
  else if( formParams.form === 'issueAssetTx'){
    //submit action
    const signAndSubmitTransaction = (transaction) => {
      const body = Object.assign({}, {password: formParams.password, transaction: transaction})
      return client.transactions.sign(body)
        .then( signed =>{
          if(!signed.data.signComplete){
            const id = uuid.v4()
            dispatch({
              type: 'GENERATED_TX_HEX',
              generated: {
                id: id,
                hex: JSON.stringify(signed.data.transaction),
              },
            })
            dispatch(push(`/transactions/generated/${id}`))

          }else{
            return client.transactions.submit(signed.data.transaction.rawTransaction)
              .then(submitSucceeded)
          }
        })
    }

    if (formParams.submitAction == 'submit') {
      return client.transactions.build(builderFunction)
        .then(tpl => signAndSubmitTransaction(tpl.data))
    }

    if( formParams.submitAction == 'sign' ){
      const transaction = JSON.parse(formParams.signTransaction)
      return signAndSubmitTransaction(transaction)
    }

  }
}

const decode = (data) => {
  return (dispatch) => {
    return  chainClient().transactions.decodeTransaction(data)
      .then((resp) => {
        if (resp.status === 'fail') {
          dispatch({type: 'ERROR', payload: {'message': resp.msg}})
        } else {
          dispatch({type: 'DECODE_TRANSACTION', data:resp.data})
        }
      })
      .catch(err => {
        dispatch({type: 'DECODE_TRANSACTION', data:[]})
        throw {_error: err}
      })
  }
}

const getAddresses =(params) => {
  return new Promise((resolve, reject) => {
    const body = Object.assign({from:0, count:1}, params)
    chainClient().accounts.listAddresses(body)
      .then((resp) =>{
        const result = resp.data
        if(result.length > 0){
          resolve(result[0].address)
        }else{
          chainClient().accounts.createAddress(params)
            .then((ret) =>{
              resolve(ret.data.address)
            }).catch((err) => reject( err))
        }
      })
      .catch((err) => reject(err))
  })
}

const estimateGas =(template) => {
  return chainClient().transactions.estimateGas(template)
}

const buildTransaction = (builderBlock) =>{
  const builderFunction = ( builder ) => {
    const processed = preprocessTransaction(builderBlock)

    builder.actions = processed.actions
    builder.ttl = builderBlock.ttl
    if (processed.baseTransaction) {
      builder.baseTransaction = processed.baseTransaction
    }

  }
  return chainClient().transactions.build(builderFunction)
}

const getTransaction = (params) => {

  return (dispatch) => {
    const promise = chainClient().transactions.getTransaction(params)

    promise.then(
      (resp) => {
        if(resp.status == 'fail'){
          dispatch({type: 'ERROR', payload: { 'message': resp.msg}})
        }else{
          resp.data = [resp.data]
          dispatch({
            type: `RECEIVED_${type.toUpperCase()}_ITEMS`,
            param: resp
          })
        }
      }
    ).catch(error=>{
      if(error.body){
        dispatch({type: 'ERROR', payload: { 'message': error.body.msg}})
      }
      else throw error
    })

    return promise
  }
}

export default {
  ...list,
  ...form,
  decode,
  getAddresses,
  estimateGas,
  buildTransaction,
  getTransaction
}
