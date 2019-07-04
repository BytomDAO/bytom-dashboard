import React from 'react'
import { Link } from 'react-router'
import {withNamespaces} from 'react-i18next'

class ListItem extends React.Component {
  render() {
    const item = this.props.item
    const t = this.props.t

    return(
      <tr>
        <td>
          <Link to={`/accounts/${item.id}`}>
            {item.alias || '-'}
          </Link>
        </td>
        <td><code>{item.id}</code></td>
        <td>
          {item.isUsed?
            <button className='btn btn-default btn-sx' disabled>
              inused
            </button>:
            <button className='btn btn-primary btn-xs' onClick={() => this.props.switch(item.alias)}>
              switch
          </button>
          }
        </td>
      </tr>
    )
  }
}

export default withNamespaces('translations') (ListItem)
