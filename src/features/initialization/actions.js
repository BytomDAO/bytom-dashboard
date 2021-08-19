import { chainClient } from 'utility/environment'
import { push } from 'react-router-redux'
import uuid from 'uuid'
import * as bytom from 'utility/bytom'

const registerKey = (data) => {
  return (dispatch) => {
    if (typeof data.accountAlias == 'string') data.accountAlias = data.accountAlias.trim()

    const keyData = {
      // alias: `${data.accountAlias}Key-${uuid.v4()}`,
      alias: `${data.accountAlias}`,
      password: data.password,
    }

    return chainClient()
      .mockHsm.keys.create(keyData)
      .then((keyRes) => {
        if (keyRes.status === 'fail') {
          throw keyRes
        }

        const accountData = {
          root_xpubs: [keyRes.data.xpub],
          quorum: 1,
          alias: data.accountAlias,
        }

        dispatch({ type: 'INIT_ACCOUNT', data: keyRes.data.mnemonic })

        return chainClient()
          .backUp.backup()
          .then((backupRes) => {
            if (backupRes.status === 'fail') throw backupRes
            const keystore = backupRes.data.key_images.xkeys.find((item) => item.xpub === keyRes.data.xpub)
            if (keystore) {
              bytom.saveMnemonic(keyRes.data.mnemonic, keyRes.data.xpub, keyData.password, keystore)
            }
          })
          .finally(() => {
            return chainClient()
              .accounts.create(accountData)
              .then((resp) => {
                if (resp.status === 'fail') {
                  throw resp
                }
                dispatch({type: 'SET_CURRENT_ACCOUNT', account: resp.data.alias})
                return chainClient()
                  .accounts.createAddress({ account_alias: resp.data.alias })
                  .then((resp) => {
                    if (resp.status === 'success') {
                      dispatch(push('/initialization/mnemonic'))
                    }
                  })
                  .catch((err) => {
                    throw err
                  })

                // if (resp.status === 'success') {
                //   dispatch({ type: 'SET_CURRENT_ACCOUNT', account: resp.data.alias })
                //   // dispatch({ type: 'SET_CURRENT_XPUB', xpubs: accountData.root_xpubs })

                //   return chainClient()
                //     .accounts.createAddress({ account_alias: resp.data.alias })
                //     .then(() => {
                //       dispatch(initSucceeded())
                //     })
                //     .catch((err) => {
                //       throw err
                //     })
                // }
              })
              .catch((err) => {
                throw err
              })
          })
      })
      .catch((err) => {
        throw err
      })
  }
}

const restoreKeystore = (data, success) => {
  return (dispatch) => {
    const file = data.file

    return new Promise(function (resolve, reject) {
      const fileReader = new FileReader()

      fileReader.onload = function (e) {
        const result = JSON.parse(e.target.result)

        return chainClient()
          .backUp.restore(result)
          .then((resp) => {
            if (resp.status === 'fail') {
              throw resp
            }
            resolve()
            dispatch(success)
          })
          .catch((err) => {
            reject(err)
          })
      }

      fileReader.readAsText(file, 'UTF-8')
      fileReader.onerror = function (error) {
        reject(error)
      }
    })
  }
}

const restoreMnemonic = (data, success) => {
  return (dispatch) => {
    if (typeof data.keyAlias == 'string') data.keyAlias = data.keyAlias.trim()
    if (typeof data.mnemonic == 'string') data.mnemonic = data.mnemonic.trim()

    const keyData = {
      alias: data.keyAlias || `key-${uuid.v4()}`,
      password: data.password,
      mnemonic: data.mnemonic,
    }
    let xpub

    return chainClient()
      .mockHsm.keys.create(keyData)
      .then((resp) => {
        if (resp.status === 'fail') {
          throw resp
        } else {
          xpub = resp.data.xpub
          return chainClient()
            .backUp.recovery({
              xpubs: [resp.data.xpub],
            })
            .then((resp) => {
              if (resp.status === 'fail') {
                throw resp
              }

              return chainClient()
                .backUp.backup()
                .then((res) => {
                  if (res.status === 'fail') throw res
                  const keystore = res.data.key_images.xkeys.find((item) => item.xpub === xpub)
                  if (keystore) {
                    bytom.saveMnemonic(data.mnemonic, xpub, data.password, keystore)
                  }
                })
                .finally(() => {
                  dispatch(success)
                })
            })
            .catch((err) => {
              throw err
            })
        }
      })
      .catch((err) => {
        throw err
      })
  }
}

const initSucceeded = () => (dispatch) => {
  dispatch({ type: 'CREATE_REGISTER_ACCOUNT' })
}

let actions = {
  initSucceeded,
  registerKey,
  restoreKeystore,
  restoreMnemonic,
}

export default actions
