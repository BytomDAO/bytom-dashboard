import { normalizeBTMAmountUnit, converIntToDec } from 'utility/buildInOutDisplay'
import { btmID } from 'utility/environment'
import { sum } from 'utility/math'

export const balance = (values, assetDecimal, balances, btmAmountUnit) => {
  let filteredBalances = balances
  if (values.accountAlias.value) {
    filteredBalances = filteredBalances.filter(balance => balance.accountAlias === values.accountAlias.value)
  }
  if (values.accountId.value) {
    filteredBalances = filteredBalances.filter(balance => balance.accountId === values.accountId.value)
  }
  if (values.assetAlias.value) {
    filteredBalances = filteredBalances.filter(balance => balance.assetAlias === values.assetAlias.value)
  }
  if (values.assetId.value) {
    filteredBalances = filteredBalances.filter(balance => balance.assetId === values.assetId.value)
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
  const accountAlias = transaction.accountAlias.value || transaction.accountAlias
  const accountId = transaction.accountId.value || transaction.accountId
  const assetAlias = transaction.assetAlias.value || transaction.assetAlias
  const assetId = transaction.assetId.value || transaction.assetId
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
        address: receiver.address.value || receiver.address,
        assetAlias,
        assetId,
        amount: Number(receiver.amount.value || receiver.amount),
        type: 'control_address'
      }
    )
  })

  return actions
}

export const issueAssetTxActionBuilder = (transaction, gas,prop) =>{
  const accountAlias = transaction.accountAlias.value || transaction.accountAlias
  const accountId = transaction.accountId.value || transaction.accountId
  const assetAlias = transaction.assetAlias.value || transaction.assetAlias
  const assetId = transaction.assetId.value || transaction.assetId
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
        address: receiver.address.value || receiver.address,
        assetAlias,
        assetId,
        amount: Number(receiver.amount.value || receiver.amount),
        type: 'control_address'
      }
    )
  })

  return actions
}

export const crossChainTxActionBuilder = (transaction, gas) =>{
  const accountAlias = transaction.accountAlias.value || transaction.accountAlias
  const accountId = transaction.accountId.value || transaction.accountId
  const assetAlias = transaction.assetAlias.value || transaction.assetAlias
  const assetId = transaction.assetId.value || transaction.assetId
  const amount = transaction.amount.value || transaction.amount
  const address = transaction.address.value || transaction.address

  const spendAction = {
    accountAlias,
    accountId,
    assetAlias,
    assetId,
    amount,
    type: 'spend_account'
  }

  const gasAction = {
    accountAlias,
    accountId,
    assetAlias: 'BTM',
    amount: gas,
    type: 'spend_account'
  }

  const crossOutAction = {
    amount,
    assetAlias,
    assetId,
    address,
    type:'cross_chain_out'
  }

  const actions = [spendAction, crossOutAction, gasAction]

  return actions
}

export const voteTxActionBuilder = (transaction, gas, address) =>{

  const accountAlias = transaction.accountAlias.value || transaction.accountAlias
  const accountId = transaction.accountId.value || transaction.accountId
  const nodePubkey = transaction.nodePubkey.value || transaction.nodePubkey
  const amount = transaction.amount.value || transaction.amount
  const action = transaction.action.value || transaction.action

  const gasAction = {
    accountAlias,
    accountId,
    asset_id:btmID,
    amount: gas,
    type: 'spend_account'
  }

  if(action === 'vote'){
    const spendAction = {
      accountAlias,
      accountId,
      assetId: btmID,
      amount,
      type: 'spend_account'
    }

    const voteAction ={
      amount,
      asset_id:btmID,
      address,
      vote: nodePubkey,
      type:'vote_output'
    }

    return [spendAction, gasAction, voteAction]
  }else if(action === 'veto'){
    const controlAction = {
      assetId: btmID,
      amount,
      address,
      type: 'control_address'
    }

    const vetoAction ={
      accountAlias,
      accountId,
      amount,
      asset_id:btmID,
      vote: nodePubkey,
      type:'unvote'
    }
    return [gasAction, vetoAction, controlAction]
  }else{
    throw 'invalid operation type.'
  }
}
