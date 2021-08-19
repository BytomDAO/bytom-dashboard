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

export const ellText = (text, width) => {
  if (!text.length) return ''
  if (text.length <= width) return text
  return `${text.substr(0, width / 2)}...${text.substr(-width / 2)}`
}

String.prototype.isUpperCase = function() {
  return this.valueOf().toUpperCase() === this.valueOf();
}
