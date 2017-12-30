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
      return {
        amount: action.amount,
        account_id: action.accountId,
        account_alias: action.accountAlias,
        asset_id: action.assetId,
        asset_alias: action.assetAlias,
        type: action.type
      }
    })
    if (processed.baseTransaction) {
      builder.baseTransaction = processed.baseTransaction
    }
  })

  if (formParams.submitAction == 'submit') {
    return buildPromise
      .then(({data: tpl}) => {
        const client = chainClient()
        const body = Object.assign({}, {Auth: '123456', 'transaction': tpl})
        return client.connection.request('/sign-submit-transaction', body, true)
      }).then(resp => {
        if (resp.status === 'fail') {
          // TODO: deal with failure
          return
        }

        dispatch(form.created())
        dispatch(push({
          pathname: '/transactions'
        }))
      })
  }
}

export default {
  ...list,
  ...form,
}
