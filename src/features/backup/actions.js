import { chainClient } from 'utility/environment'

let actions = {
  backup: (currentAccount)=>{
    return function(dispatch) {
      return chainClient().backUp.backup()
        .then(resp => {
          if (resp.status === 'fail') {
            throw resp
          }

          const date = new Date()
          const dateStr = date.toLocaleDateString().split(' ')[0]
          const timestamp = date.getTime()
          const fileName = ['bytom-wallet-backup-', dateStr, timestamp].join('-')+'.dat'

          let element = document.createElement('a')
          element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(resp.data)))
          element.setAttribute('download', fileName)
          element.style.display = 'none'
          document.body.appendChild(element)
          element.click()

          document.body.removeChild(element)

        }).catch((err) => {
          throw err
        })
    }
  },

  success: ()=>{
    return (dispatch) => {
      dispatch( { type: 'HIDE_MODAL' })
      dispatch({type: 'RESTORE_SUCCESS'})
    }
  }

}

export default actions
