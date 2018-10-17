import React from 'react'
import { Link } from 'react-router'
import {withNamespaces} from 'react-i18next'

class ListItem extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {item, t} = this.props

    return(
      <tr>
        <td>{item.alias}</td>
        <td><code>{item.xpub}</code></td>
        <td><Link to={`/keys/${item.id}`}>
          {t('form.more')}
        </Link></td>
      </tr>
    )
  }
}

export default withNamespaces('translations') (ListItem)
