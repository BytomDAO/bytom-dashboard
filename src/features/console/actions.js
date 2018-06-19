import { chainClient } from 'utility/environment'

let actions = {
  request: (data) => () => {
    return chainClient().bytomCli.request(data)
  }
}

export default actions
