import _pluralize from 'pluralize'
import { snakeCase } from 'lodash'

export const pluralize = _pluralize

export const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const humanize = (string) => {
  return snakeCase(string)
    .replace(/_/g, ' ')
}

export const parseNonblankJSON = (json) => {
  json = json || ''
  json = json.trim()

  if (json == '') {
    return null
  }

  return JSON.parse(json)
}

String.prototype.isUpperCase = function() {
  return this.valueOf().toUpperCase() === this.valueOf();
}

String.prototype.toHex = function () {
  const str = this.valueOf()
  let hex = '';
  for(let i=0;i<str.length;i++) {
    hex += ''+str.charCodeAt(i).toString(16);
  }
  return hex;
}
