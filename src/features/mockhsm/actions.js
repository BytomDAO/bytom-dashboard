import { baseListActions, baseCreateActions } from 'features/shared/actions'
import { chainClient } from 'utility/environment'

const type = 'key'
const clientApi = () => chainClient().mockHsm.keys

export default {
  ...baseCreateActions(type, {
    className: 'Key',
    clientApi,
  }),
  ...baseListActions(type, {
    className: 'Key',
    clientApi,
  }),
}
