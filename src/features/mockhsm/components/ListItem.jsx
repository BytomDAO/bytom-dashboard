import React from 'react'
import { chainClient } from 'utility/environment'

const clientApi = () => chainClient().mockHsm.keys

class ListItem extends React.Component {
  constructor(props) {
    super(props)

    this.echo = (item) => clientApi().export(item.xpub).then(resp => {
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

  render() {
    const item = this.props.item

    return(
      <tr>
        <td>{item.alias}</td>
        <td><code>{item.xpub}</code></td>
        <td>
          {
            (item.complete === undefined || item.complete === true) &&
            <button className='btn btn-link' onClick={this.echo.bind(this, item)}>
              Export private key
            </button>
          }
          {
            item.complete !== undefined && item.complete === false &&
            <span>{`${34}% imported...`}</span>
          }
        </td>
      </tr>
    )
  }
}

export default ListItem
