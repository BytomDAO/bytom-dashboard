import { baseListActions, baseCreateActions } from 'features/shared/actions'
import { chainClient } from 'utility/environment'

const type = 'key'
const clientApi = () => chainClient().mockHsm.keys

const list = baseListActions(type, {
  className: 'Key',
  clientApi,
})
const create = baseCreateActions(type, {
  className: 'Key',
  clientApi,
})

export default {
  ...create,
  ...list,
  createExport: (item) => () => {
    clientApi().export(item.xpub).then(resp => {
      const privateKey = resp.data.privateKey

      var element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(privateKey))
      element.setAttribute('download', item.alias)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()

      document.body.removeChild(element)
    })
  }
}
