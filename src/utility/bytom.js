import Crypto from 'crypto-js'
import bytomjs from 'bytomjs-lib/bytomjs-lib'
/**
 * encrypt mnemonic by keystore
 * @param {*} mnemonic 
 * @param {*} password 
 * @param {*} keystore 
 * @returns {string} ciphertext
 */
export function encryptMnemonic(mnemonic, password, keystore) {
  const result = bytomjs.key.decrypt(keystore, password)
  const xprv = result.xPrv.toString('hex')
  const ciphertext = Crypto.AES.encrypt(mnemonic, xprv)
  return ciphertext.toString()
}

export function saveMnemonic (mnemonic, xpub, password, keystore) {
  const enMnemonic = encryptMnemonic(mnemonic, password, keystore)
  localStorage.setItem(`mnemonic:${xpub}`, enMnemonic)
}

export function getLocalMnemonic (xpub, password, keystore) {
  const ciphertext = localStorage.getItem(`mnemonic:${xpub}`)
  if (ciphertext) {
    const result = decryptMnemonic(ciphertext, password, keystore)
    return result
  }
}

/**
 * decrypt mnemonic by keystore
 * @param {*} ciphertext 
 * @param {*} password 
 * @param {*} keystore 
 * @returns {string} mnemonic
 */
export function decryptMnemonic (ciphertext, password, keystore) {
  const result = bytomjs.key.decrypt(keystore, password)
  const xprv = result.xPrv.toString('hex')
  const bytes = Crypto.AES.decrypt(ciphertext, xprv)
  const mnemonic = bytes.toString(Crypto.enc.Utf8)
  return mnemonic
}

/**
 * decrypt keystore
 * @param {*} password 
 * @param {*} keystore 
 * @returns 
 */
export function decryptKeystore(password, keystore) {
  const result = bytomjs.key.decrypt(keystore, password)
  result.xpub = result.xPub.toString('hex')
  delete result['xPub']
  return result
}