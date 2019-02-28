import _ from 'lodash'

export const sum = function(items, prop){
  return items.reduce( function(a, b){
    return a + Number(_.get(b,prop))
  }, 0)
}

export const formatBytes = function(bytes,decimals) {
  if (bytes == 0) return '0 Bytes'
  let k = 1024,
    dm = decimals <= 0 ? 0 : decimals || 2,
    sizes = ['B', 'KB', 'MB', 'GB', 'TB'],
    i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export  const splitSlice = function (str, len) {
  let ret = [ ]
  for (let offset = 0, strLen = str.length; offset < strLen; offset += len) {
    ret.push(str.slice(offset, len + offset))
  }
  return ret
}
