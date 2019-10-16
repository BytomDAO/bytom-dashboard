import { normalizeBTMAmountUnit, converIntToDec } from 'utility/buildInOutDisplay'
import { btmID } from 'utility/environment'
import { sum } from 'utility/math'

export const balance = (values, assetDecimal, balances, btmAmountUnit) => {
  let filteredBalances = balances
  if (values.accountAlias) {
    filteredBalances = filteredBalances.filter(balance => balance.accountAlias === values.accountAlias)
  }
  if (values.accountId) {
    filteredBalances = filteredBalances.filter(balance => balance.accountId === values.accountId)
  }
  if (values.assetAlias) {
    filteredBalances = filteredBalances.filter(balance => balance.assetAlias === values.assetAlias)
  }
  if (values.assetId) {
    filteredBalances = filteredBalances.filter(balance => balance.assetId === values.assetId)
  }

  if(filteredBalances.length === 1){
    if (filteredBalances[0].assetId === btmID){
      return normalizeBTMAmountUnit(filteredBalances[0].assetId, filteredBalances[0].amount, btmAmountUnit)
    }else if( assetDecimal ){
      return converIntToDec(filteredBalances[0].amount, assetDecimal)
    }else{
      return filteredBalances[0].amount
    }
  }else {
    return null
  }
}

export const getAssetDecimal = (values, asset) => {
  let filteredAsset = asset
  if (values.assetAlias.value) {
    filteredAsset = filteredAsset.filter(asset => asset.alias === values.assetAlias.value)
  }
  if (values.assetId.value) {
    filteredAsset = filteredAsset.filter(asset => asset.id === values.assetId.value)
  }

  return (filteredAsset.length === 1 && filteredAsset[0].definition && filteredAsset[0].id !== btmID ) ?
    filteredAsset[0].definition.decimals : null
}

export const normalTxActionBuilder = (transaction, gas, prop) =>{
  const accountAlias =  transaction.accountAlias
  const accountId = transaction.accountId
  const assetAlias = transaction.assetAlias
  const assetId = transaction.assetId
  const receivers = transaction.receivers

  const totalAmount = sum(receivers, prop )

  const spendAction = {
    accountAlias,
    accountId,
    assetAlias,
    assetId,
    amount: totalAmount,
    type: 'spend_account'
  }

  const gasAction = {
    accountAlias,
    accountId,
    assetAlias: 'BTM',
    amount: gas,
    type: 'spend_account'
  }

  const actions = [spendAction, gasAction]
  receivers.forEach((receiver)=>{
    actions.push(
      {
        address: receiver.address,
        assetAlias,
        assetId,
        amount: Number(receiver.amount),
        type: 'control_address'
      }
    )
  })

  return actions
}

export const issueAssetTxActionBuilder = (transaction, gas,prop) =>{
  const accountAlias = transaction.accountAlias
  const accountId = transaction.accountId
  const assetAlias = transaction.assetAlias
  const assetId =  transaction.assetId
  const receivers = transaction.receivers

  const totalAmount = sum(receivers, prop )

  const spendAction = {
    assetAlias,
    assetId,
    amount: totalAmount,
    type: 'issue'
  }

  const gasAction = {
    accountAlias,
    accountId,
    assetAlias: 'BTM',
    amount: gas,
    type: 'spend_account'
  }

  const actions = [spendAction, gasAction]
  receivers.forEach((receiver)=>{
    actions.push(
      {
        address: receiver.address,
        assetAlias,
        assetId,
        amount: Number(receiver.amount),
        type: 'control_address'
      }
    )
  })

  return actions
}
