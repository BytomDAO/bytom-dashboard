const bytomCLI = (client) => {

  return {
    request: (params) => {
      const cmdArrays = params.split(' ')
      let requestParams = {}

      if(params.startsWith('create-key')){
        requestParams = {
          'alias': cmdArrays[1],
          'password':  cmdArrays[2]
        }
      }

      return client.request(`/${cmdArrays[0]}`, requestParams)
    }
  }
}

module.exports = bytomCLI
