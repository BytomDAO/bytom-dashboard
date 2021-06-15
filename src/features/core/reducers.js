import { combineReducers } from 'redux'
import { testnetUrl } from 'utility/environment'
import moment from 'moment'
import { DeltaSampler } from 'utility/time'

const LONG_TIME_FORMAT = 'YYYY-MM-DD, h:mm:ss a'

const coreConfigReducer = (key, state, defaultState, action) => {
  if (action.type == 'UPDATE_CORE_INFO') {
    return action.param.data[key] || defaultState
  }

  return state || defaultState
}

const buildConfigReducer = (key, state, defaultState, action) => {
  // if (action.type == 'UPDATE_CORE_INFO') {
  // return action.param.buildConfig[key] || defaultState
  // }

  return state || defaultState
}

const configKnown = (state = false, action) => {
  if (action.type == 'UPDATE_CORE_INFO') {
    return true
  }
  return state
}

let configuredState = false
if (window.remote) {
  configuredState = window.remote.getGlobal('fileExist')
}
export const configured =
  process.env.TARGET === 'electron'
    ? (state = configuredState, action) => {
        if (action.type == 'SET_CONFIGURED') {
          return true
        }
        return state
      }
    : (state, action) => coreConfigReducer('isConfigured', state, false, action)

export const configuredAt = (state, action) => {
  let value = coreConfigReducer('configuredAt', state, '', action)
  if (action.type == 'UPDATE_CORE_INFO' && value != '') {
    value = moment(value).format(LONG_TIME_FORMAT)
  }
  return value
}

// export const mockhsm = (state, action) =>
//   buildConfigReducer('isMockhsm', state, false, action)
// export const localhostAuth = (state, action) =>
//   buildConfigReducer('isLocalhostAuth', state, false, action)
// export const reset = (state, action) =>
//   buildConfigReducer('isReset', state, false, action)
// export const httpOk = (state, action) =>
//   buildConfigReducer('isHttpOk', state, false, action)
export const blockHeight = (state, action) => coreConfigReducer('highestBlock', state, 0, action)
export const currentBlockHeight = (state, action) => coreConfigReducer('currentBlock', state, 0, action)
export const peerCount = (state, action) => coreConfigReducer('peerCount', state, 0, action)
export const generatorBlockHeight = (state, action) => {
  if (action.type == 'UPDATE_CORE_INFO') {
    if (action.param.generatorBlockHeight == 0) return '???'
  }

  return coreConfigReducer('generatorBlockHeight', state, 0, action)
}
export const signer = (state, action) => coreConfigReducer('isSigner', state, false, action)
export const generator = (state, action) => coreConfigReducer('isGenerator', state, false, action)
export const generatorUrl = (state, action) => coreConfigReducer('generatorUrl', state, false, action)
export const generatorAccessToken = (state, action) => coreConfigReducer('generatorAccessToken', state, false, action)
export const blockchainId = (state, action) => coreConfigReducer('blockchainId', state, 0, action)
// export const crosscoreRpcVersion = (state, action) =>
//   coreConfigReducer('crosscoreRpcVersion', state, 0, action)
//
// export const coreType = (state = '', action) => {
//   if (action.type == 'UPDATE_CORE_INFO') {
//     if (action.param.isGenerator) return 'Generator'
//     if (action.param.isSigner) return 'Signer'
//     return 'Participant'
//   }
//   return state
// }
//
// export const replicationLag = (state = null, action) => {
//   if (action.type == 'UPDATE_CORE_INFO') {
//     if (action.param.generatorBlockHeight == 0) {
//       return null
//     }
//     return action.param.generatorBlockHeight - action.param.blockHeight
//   }
//
//   return state
// }

// let syncSamplers = null
// const resetSyncSamplers = () => {
//   syncSamplers = {
//     snapshot: new DeltaSampler({sampleTtl: 10 * 1000}),
//     replicationLag: new DeltaSampler({sampleTtl: 10 * 1000}),
//   }
// }
//
// export const syncEstimates = (state = {}, action) => {
//   switch (action.type) {
//     case 'UPDATE_CORE_INFO': {
//       if (!syncSamplers) {
//         resetSyncSamplers()
//       }
//
//       const {
//         snapshot,
//         generatorBlockHeight,
//         blockHeight,
//       } = action.param
//
//       const estimates = {}
//
//       if (snapshot && snapshot.inProgress) {
//         const speed = syncSamplers.snapshot.sample(snapshot.downloaded)
//
//         if (speed != 0) {
//           estimates.snapshot = (snapshot.size - snapshot.downloaded) / speed
//         }
//       } else if (generatorBlockHeight > 0) {
//         const replicationLag = generatorBlockHeight - blockHeight
//         const speed = syncSamplers.replicationLag.sample(replicationLag)
//         if (speed != 0) {
//           const duration = -1 * replicationLag / speed
//           if (duration > 0) {
//             estimates.replicationLag = duration
//           }
//         }
//       }
//
//       return estimates
//     }
//
//     case 'CORE_DISCONNECT':
//       resetSyncSamplers()
//       return {}
//
//     default:
//       return state
//   }
// }
//
// export const replicationLagClass = (state = null, action) => {
//   if (action.type == 'UPDATE_CORE_INFO') {
//     if (action.param.generatorBlockHeight == 0) {
//       return 'red'
//     } else {
//       let lag = action.param.generatorBlockHeight - action.param.blockHeight
//       if (lag < 5) {
//         return 'green'
//       } else if (lag < 10) {
//         return 'yellow'
//       } else {
//         return 'red'
//       }
//     }
//   }
//
//   return state
// }

// export const onTestnet = (state = false, action) => {
//   if (action.type == 'UPDATE_CORE_INFO') {
//     return (action.param.generatorUrl || '').indexOf(testnetUrl) >= 0
//   }
//
//   return state
// }

export const requireClientToken = (state = false, action) => {
  if (action.type == 'ERROR' && action.payload.status == 401) return true

  return state
}

export const clientToken = (state = '', action) => {
  if (action.type == 'SET_CLIENT_TOKEN') return action.token
  else if (action.type == 'ERROR' && action.payload.status == 401) return ''

  return state
}

export const validToken = (state = false, action) => {
  if (action.type == 'SET_CLIENT_TOKEN') return false
  else if (action.type == 'USER_LOG_IN') return true
  else if (action.type == 'ERROR' && action.payload.status == 401) return false

  return state
}

export const connected = (state = true, action) => {
  if (action.type == 'UPDATE_CORE_INFO') return true
  else if (action.type == 'CORE_DISCONNECT') return false

  return state
}

export const btmAmountUnit = (state = 'BTM', action) => {
  if (action.type == 'UPDATE_BTM_AMOUNT_UNIT') {
    return action.param
  }
  return state
}

const mingStatus = (state = false, action) => {
  if (action.type == 'UPDATE_CORE_INFO') {
    return action.param.data.mining
  }
  return state
}

const coreData = (state = null, action) => {
  if (action.type == 'UPDATE_CORE_INFO') {
    return action.param.data || null
  }
  return state
}

const accountInit = (state = false, action) => {
  if (action.type == 'CREATE_REGISTER_ACCOUNT') {
    return true
  } else if (action.type == 'UPDATE_ACCOUNT_INIT_STATUS') {
    return action.param
  }
  return state
}

const snapshot = (state = null, action) => {
  if (action.type == 'UPDATE_CORE_INFO') {
    return action.param.snapshot || null // snapshot may be undefined, which Redux doesn't like.
  }
  return state
}

const version = (state = 'N/A', action) => {
  if (action.type == 'UPDATE_CORE_INFO') {
    return action.param.data.versionInfo.version
  }
  return state
}

const newVersionCode = (state = 'N/A', action) => {
  if (action.type == 'UPDATE_CORE_INFO') {
    return action.param.data.versionInfo.newVersion
  }
  return state
}

const update = (state = false, action) => {
  if (action.type == 'UPDATE_CORE_INFO') {
    return action.param.data.versionInfo.update > 0
  }
  return state
}

export default combineReducers({
  accountInit,
  blockchainId,
  blockHeight,
  connected,
  clientToken,
  configKnown,
  configured,
  configuredAt,
  // coreType,
  coreData,
  currentBlockHeight,
  generator,
  generatorAccessToken,
  generatorBlockHeight,
  generatorUrl,
  // localhostAuth,
  // newVersionCode,
  // mockhsm,
  mingStatus,
  // crosscoreRpcVersion,
  // onTestnet,
  // httpOk,
  peerCount,
  // replicationLag,
  // replicationLagClass,
  requireClientToken,
  // reset,
  signer,
  snapshot,
  // syncEstimates,
  update,
  validToken,
  version,
  btmAmountUnit,
})
