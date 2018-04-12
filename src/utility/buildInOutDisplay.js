const mappings = {
  id: 'ID',
  type: 'Type',
  purpose: 'Purpose',
  transactionId: 'Transaction ID',
  position: 'Position',
  assetId: 'Asset ID',
  assetAlias: 'Asset Alias',
  assetDefinition: 'Asset Definition',
  assetTags: 'Asset Tags',
  assetIsLocal: 'Asset Is Local?',
  amount: 'Amount',
  accountId: 'Account ID',
  accountAlias: 'Account Alias',
  accountTags: 'Account Tags',
  controlProgram: 'Control Program',
  address: 'Address',
  programIndex: 'Program Index',
  spentOutputId: 'Spent Output ID',
  refData: 'Reference Data',
  sourceId: 'Source ID',
  sourcePos: 'Source Postion',
  issuanceProgram: 'Issuance Program',
  isLocal: 'Local?',
  referenceData: 'Reference Data',
}

const txInputFields = [
  'type',
  'assetId',
  'assetAlias',
  'assetDefinition',
  'assetTags',
  'assetIsLocal',
  'amount',
  'accountId',
  'accountAlias',
  'accountTags',
  'issuanceProgram',
  'controlProgram',
  'address',
  'spentOutputId',
  'isLocal',
  'referenceData',
]

const txOutputFields = [
  'type',
  'purpose',
  'id',
  'position',
  'assetId',
  'assetAlias',
  'assetDefinition',
  'assetTags',
  'assetIsLocal',
  'amount',
  'accountId',
  'accountAlias',
  'accountTags',
  'controlProgram',
  'address',
  'isLocal',
  'referenceData',
]

const unspentFields = [
  'type',
  'purpose',
  'transactionId',
  'position',
  'assetId',
  'assetAlias',
  'assetDefinition',
  'assetTags',
  'assetIsLocal',
  'amount',
  'accountId',
  'accountAlias',
  'accountTags',
  'controlProgram',
  'programIndex',
  'refData',
  'sourceId',
  'sourcePos',
  'isLocal',
  'referenceData',
]

const balanceFields = Object.keys(mappings)

const buildDisplay = (item, fields, btmAmountUnit) => {
  const details = []
  fields.forEach(key => {
    if (item.hasOwnProperty(key)) {
      if(key === 'amount'){
        details.push({label: mappings[key], value: normalizeGlobalBTMAmount(item['assetId'], item[key], btmAmountUnit)})
      }else{
        details.push({label: mappings[key], value: item[key]})
      }
    }
  })
  return details
}

const addZeroToDecimalPos = (src,pos) => {
  if(src != null ){
    let srcString = src.toString()
    var rs = srcString.indexOf('.')
    if (rs < 0) {
      rs = srcString.length
      srcString += '.'
    }
    while (srcString.length <= rs + pos) {
      srcString += '0'
    }
    return srcString
  }
  return src
}

const formatIntNumToPosDecimal = (neu,pos) => {
  if(neu != null ){
    let neuString = neu.toString()
    if(neuString.length<=8){
      return addZeroToDecimalPos((neu/Math.pow(10, pos)), pos)
    }else {
      return neuString.slice(0, -pos) + '.' + neuString.slice(-pos)
    }
  }
  return neu
}

export const normalizeGlobalBTMAmount = (assetID, amount, btmAmountUnit) => {
  //normalize BTM Amount
  if (assetID === 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff') {
    switch (btmAmountUnit){
      case 'BTM':
        return formatIntNumToPosDecimal(amount, 8)+' BTM'
      case 'mBTM':
        return formatIntNumToPosDecimal(amount, 5)+' mBTM'
      case 'NEU':
        return amount+' NEU'
    }
  }
  return amount
}

export function formatBTMAmount(value, pos)  {
  if (!value) {
    return value
  }

  const onlyNums = value.toString().replace(/[^0-9.]/g, '')

  // Create an array with sections split by .
  const sections = onlyNums.split('.')

  // Remove any leading 0s apart from single 0
  if (sections[0] !== '0' && sections[0] !== '00') {
    sections[0] = sections[0].replace(/^0+/, '')
  } else {
    sections[0] = '0'
  }

  // If numbers exist after first .
  if (sections[1]) {
    return sections[0] + '.' + sections[1].slice(0, pos)
  } else if (onlyNums.indexOf('.') !== -1) {
    return sections[0] + '.'
  } else {
    return sections[0]
  }
}

export function parseBTMAmount(value, pos){
  if (!value) {
    return value
  }

  const onlyNums = value.replace(/[^0-9.]/g, '')
  const sections = onlyNums.split('.')

  let numDecimal = ''

  if (sections[1]) {
    numDecimal = sections[1].slice(0, pos)
  }
  while (numDecimal.length < pos) {
    numDecimal += '0'
  }

  //remove all the leading 0s
  let amountNum = sections[0] + numDecimal
  if(/^0*$/.test(amountNum)){
    amountNum = '0'
  }else {
    amountNum = amountNum.replace(/^0+/, '')
  }

  return amountNum
}

export function normalizeBTMAmountUnit(assetID, amount, btmAmountUnit) {
  return normalizeGlobalBTMAmount(assetID, amount, btmAmountUnit)
}

export function addZeroToDecimalPosition(value, deciPoint){
  return addZeroToDecimalPos(value, deciPoint)
}

export function converIntToDec(int, deciPoint){
  return formatIntNumToPosDecimal(int, deciPoint)
}

export function buildTxInputDisplay(input, btmAmountUnit) {
  return buildDisplay(input, txInputFields, btmAmountUnit)
}

export function buildTxOutputDisplay(output, btmAmountUnit) {
  return buildDisplay(output, txOutputFields, btmAmountUnit)
}

export function buildUnspentDisplay(output, btmAmountUnit) {
  const normalized = {
    amount: output.amount,
    accountId: output.accountId,
    accountAlias: output.accountAlias,
    assetId: output.assetId,
    assetAlias: output.assetAlias,
    controlProgram: output.program,
    programIndex: output.controlProgramIndex,
    sourceId: output.sourceId,
    sourcePos: output.sourcePos
  }
  return buildDisplay(normalized, unspentFields, btmAmountUnit)
}

export function buildBalanceDisplay(balance, btmAmountUnit) {
  return buildDisplay({
    amount: balance.amount,
    assetId: balance.assetId,
    assetAlias: balance.assetAlias,
    accountAlias: balance.accountAlias
  }, balanceFields, btmAmountUnit)
}
