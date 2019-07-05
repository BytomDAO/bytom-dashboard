import React from 'react'
import { Link } from 'react-router'
import {withNamespaces} from 'react-i18next'
import styles from './ListItem.scss'

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
            <button className={`btn btn-default btn-sx ${styles.selectButton}`} disabled>
              {t('account.selected')}
            </button>:
            <button className={`btn btn-primary btn-xs ${styles.selectButton}`} onClick={() => this.props.switch(item.alias)}>
              {t('account.select')}
            </button>
          }
        </td>
      </tr>
    )
  }
}

export default withNamespaces('translations') (ListItem)
