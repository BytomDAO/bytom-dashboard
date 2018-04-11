import uuid from 'uuid'
import { chainClient } from 'utility/environment'
import { parseNonblankJSON } from 'utility/string'
import { push } from 'react-router-redux'
import { baseCreateActions, baseListActions } from 'features/shared/actions'

const type = 'transaction'

const list = baseListActions(type, {
  defaultKey: 'id'
})
const form = baseCreateActions(type)

function preprocessTransaction(formParams) {
  const copy = JSON.parse(JSON.stringify(formParams))
  const builder = {
    baseTransaction: copy.baseTransaction,
    actions: copy.actions,
  }

  const normalT = formParams.normalTransaction
  if( builder.actions.length == 0){
    builder.actions.push({accountAlias: normalT.accountAlias, accountId: normalT.accountId, assetAlias: 'BTM', amount: Number(normalT.gas.price), type: 'spend_account'})
    builder.actions.push({accountAlias: normalT.accountAlias, accountId: normalT.accountId, assetAlias: normalT.assetAlias, assetId: normalT.assetId, amount: normalT.amount, type: 'spend_account'})
    builder.actions.push({address: normalT.address, assetAlias: normalT.assetAlias, assetId: normalT.assetId, amount: normalT.amount, type: 'control_address'})
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
        if ((parseInt(value)+'') == value) {
          a[key] = parseInt(value)
        } else {
          throw new Error(`Action ${parseInt(i)+1} ${key} must be an integer.`)
        }
      }
    })

    try {
      a.referenceData = parseNonblankJSON(a.referenceData)
    } catch (err) {
      throw new Error(`Action ${parseInt(i)+1} reference data should be valid JSON, or blank.`)
    }

    try {
      a.receiver = parseNonblankJSON(a.receiver)
    } catch (err) {
      throw new Error(`Action ${parseInt(i)+1} receiver should be valid JSON.`)
    }
  }

  return builder
}

form.submitForm = (formParams) => function(dispatch) {
  const buildPromise = chainClient().transactions.build(builder => {
    const processed = preprocessTransaction(formParams)

    builder.actions = processed.actions.map(action => {
      let result = {
        address: action.address,
        amount: action.amount,
        account_id: action.accountId,
        account_alias: action.accountAlias,
        asset_id: action.assetId,
        asset_alias: action.assetAlias,
        type: action.type,
      }
      if (action.receiver) {
        result.receiver = {
          control_program: action.receiver.controlProgram,
          expires_at: action.receiver.expiresAt
        }
      }
      return result
    })
    if (processed.baseTransaction) {
      builder.baseTransaction = processed.baseTransaction
    }
  })

  if (formParams.submitAction == 'submit') {
    return buildPromise
      .then((resp) => {
        if (resp.status === 'fail') {
          throw new Error(resp.msg)
        }

        const body = Object.assign({}, {password: formParams.password, 'transaction': resp.data})
        return chainClient().connection.request('/sign-submit-transaction', body, true)
      }).then(resp => {
        if (resp.status === 'fail') {
          throw new Error(resp.msg)
        }

        dispatch(form.created())
        dispatch(push({
          pathname: '/transactions'
        }))
      })
  }

  // submitAction == 'generate'
  return buildPromise.then(resp => {
    if (resp.status === 'fail') {
      throw new Error(resp.msg)
    }

    const body = Object.assign({}, {password: formParams.password, 'transaction': resp.data})
    return chainClient().connection.request('/sign-transaction', body, true)
  }).then(resp => {
    if (resp.status === 'fail') {
      throw new Error(resp.msg)
    }
    const id = uuid.v4()
    dispatch({
      type: 'GENERATED_TX_HEX',
      generated: {
        id: id,
        hex: resp.data.transaction.raw_transaction,
      },
    })
    dispatch(push(`/transactions/generated/${id}`))
  })
}

export default {
  ...list,
  ...form,
}
