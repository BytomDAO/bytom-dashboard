import uuid from 'uuid'
import {chainClient} from 'utility/environment'
import {parseNonblankJSON} from 'utility/string'
import {push} from 'react-router-redux'
import {baseCreateActions, baseListActions} from 'features/shared/actions'

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
    let gasPrice = 0
    switch (formParams.gas.type) {
      case 'Fast':
        gasPrice = formParams.state.estimateGas * 2
        break
      case 'Customize':
        gasPrice = formParams.gas.price
        break
      case 'Standard':
      default:
        gasPrice = formParams.state.estimateGas * 1
        break
    }

    builder.actions.push({
      accountAlias: formParams.accountAlias,
      accountId: formParams.accountId,
      assetAlias: 'BTM',
      amount: Number(gasPrice),
      type: 'spend_account'
    })
    builder.actions.push({
      accountAlias: formParams.accountAlias,
      accountId: formParams.accountId,
      assetAlias: formParams.assetAlias,
      assetId: formParams.assetId,
      amount: formParams.amount,
      type: 'spend_account'
    })
    builder.actions.push({
      address: formParams.address,
      assetAlias: formParams.assetAlias,
      assetId: formParams.assetId,
      amount: formParams.amount,
      type: 'control_address'
    })
  }

  if (builder.baseTransaction == '') {
    delete builder.baseTransaction
  }

  if (formParams.submitAction == 'generate') {
    builder.ttl = '1h' // 1 hour
  }

  for (let i in builder.actions) {
    let a = builder.actions[i]

    const intFields = ['amount', 'position']
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

  const buildPromise = (formParams.state.showAdvanced && formParams.signTransaction) ? null :
    client.transactions.build(builder => {
      const processed = preprocessTransaction(formParams)

      builder.actions = processed.actions
      if (processed.baseTransaction) {
        builder.baseTransaction = processed.baseTransaction
      }
    })

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
  if(formParams.form === 'normalTx'){
    return buildPromise
      .then(tpl => {
        const body = Object.assign({}, {password: formParams.password, transaction: tpl.data})
        return client.transactions.sign(body)
      })
      .then(signed => {
        if(!signed.data.signComplete){
          throw new Error('Signature failed, it might be your password is wrong.')
        }
        return client.transactions.submit(signed.data.transaction.rawTransaction)
      })
      .then(submitSucceeded)
  }
  //advanced transactions
  else{
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
}

export default {
  ...list,
  ...form,
}
