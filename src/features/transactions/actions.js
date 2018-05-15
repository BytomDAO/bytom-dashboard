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

  const normalT = formParams
  if (builder.actions.length == 0) {
    let gasPrice = 0
    switch (normalT.gas.type) {
      case 'Fast':
        gasPrice = formParams.state.estimateGas * 2
        break
      case 'Customize':
        gasPrice = normalT.gas.price
        break
      case 'Standard':
      default:
        gasPrice = formParams.state.estimateGas * 1
        break
    }

    builder.actions.push({
      accountAlias: normalT.accountAlias,
      accountId: normalT.accountId,
      assetAlias: 'BTM',
      amount: Number(gasPrice),
      type: 'spend_account'
    })
    builder.actions.push({
      accountAlias: normalT.accountAlias,
      accountId: normalT.accountId,
      assetAlias: normalT.assetAlias,
      assetId: normalT.assetId,
      amount: normalT.amount,
      type: 'spend_account'
    })
    builder.actions.push({
      address: normalT.address,
      assetAlias: normalT.assetAlias,
      assetId: normalT.assetId,
      amount: normalT.amount,
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
  const connection = chainClient().connection

  const processed = preprocessTransaction(formParams)
  const buildPromise = connection.request('/build-transaction', {actions: processed.actions})

  const signAndSubmitTransaction = (transaction, password) => {
    return connection.request('/sign-transaction', {
      password,
      transaction
    }).then(resp => {
      if (resp.status === 'fail') {
        throw new Error(resp.msg)
      }

      const rawTransaction = resp.data.transaction.rawTransaction
      return connection.request('/submit-transaction', {rawTransaction})
    }).then(dealSignSubmitResp)
  }

  const dealSignSubmitResp = resp => {
    if (resp.status === 'fail') {
      throw new Error(resp.msg)
    }

    dispatch(form.created())
    dispatch(push({
      pathname: '/transactions',
      state: {
        preserveFlash: true
      }
    }))
  }

  if (formParams.actions.length !== 0
    && formParams.state.showAdvanced
    && formParams.baseTransaction
    && formParams.submitAction == 'submit') {
    const transaction = JSON.parse(formParams.baseTransaction)
    return signAndSubmitTransaction(transaction, formParams.password)
  }

  if (formParams.actions.length !== 0
    && formParams.state.showAdvanced
    && formParams.baseTransaction
    && formParams.submitAction !== 'submit') {
    const transaction = JSON.parse(formParams.baseTransaction)
    return connection.request('/sign-transaction', {
      password: formParams.password,
      transaction
    }).then(resp => {
      if (resp.status === 'fail') {
        throw new Error(resp.msg)
      }

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

  if (formParams.submitAction == 'submit') {
    return buildPromise
      .then((resp) => {
        if (resp.status === 'fail') {
          throw new Error(resp.msg)
        }

        return signAndSubmitTransaction(resp.data, formParams.password)
      })
  }

  // submitAction == 'generate'
  return buildPromise.then(resp => {
    if (resp.status === 'fail') {
      throw new Error(resp.msg)
    }

    const body = Object.assign({}, {password: formParams.password, 'transaction': resp.data})
    return connection.request('/sign-transaction', body)
  }).then(resp => {
    if (resp.status === 'fail') {
      throw new Error(resp.msg)
    }
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

export default {
  ...list,
  ...form,
}
