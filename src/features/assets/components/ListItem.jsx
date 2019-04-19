import React from 'react'
import { Link } from 'react-router'
import {withNamespaces} from 'react-i18next'
import { btmID } from 'utility/environment'

class ListItem extends React.Component {
  render() {
    const {item, t} = this.props

    const result =
      item.id !== btmID && (
        <tr>
          <td>{item.alias || '-'}</td>
          <td><code>{item.id}</code></td>
          <td>
            <Link to={`/assets/${item.id}`}>
              {t('commonWords.viewDetails')} →
            </Link>
          </td>
        </tr>
      )

    return result
  }
}

export default withNamespaces('translations') ( ListItem)
