import React from 'react'
import {withNamespaces} from 'react-i18next'

class ListItem extends React.Component {
  render() {
    const {item, t} = this.props

    return(
      <tr>
        <td>{item.remoteAddr || '-'}</td>
        <td><code>{item.height}</code></td>
        <td><code>{item.ping}</code></td>
        <td><code>{item.duration}</code></td>
        <td>{ item.totalSent+ item.totalReceived }</td>
        <td>
          <button className='btn btn-link' onClick={() => this.props.disconnect(item.peerId)}>
            {t('peers.disconnect')}
          </button>
        </td>
      </tr>
    )
  }
}

export default withNamespaces('translations') (ListItem)
