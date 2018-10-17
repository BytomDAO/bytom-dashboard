import React from 'react'
import { Link } from 'react-router'
import {withNamespaces} from 'react-i18next'

class ListItem extends React.Component {
  render() {
    const item = this.props.item
    const t = this.props.t

    return(
      <tr>
        <td>{item.alias || '-'}</td>
        <td><code>{item.id}</code></td>
        <td>
          <Link to={`/accounts/${item.id}`}>
            {t('commonWords.viewDetails')} →
          </Link>
        </td>
      </tr>
    )
  }
}

export default withNamespaces('translations') (ListItem)
