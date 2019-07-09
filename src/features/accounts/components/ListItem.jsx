import React from 'react'
import { Link } from 'react-router'
import {withNamespaces} from 'react-i18next'
import styles from './ListItem.scss'

class ListItem extends React.Component {
  render() {
    const item = this.props.item
    const t = this.props.t

    return(
      <tr className={styles.tr}>
        <td>
          <Link to={`/accounts/${item.id}`}>
            {item.alias || '-'}
          </Link>
        </td>
        <td><code>{item.id}</code></td>
        <td>
          {item.isUsed?
            <button className={`btn btn-default btn-sm ${styles.selectButton} ${styles.buttonDisable}`} disabled>
              {t('account.selected')}
            </button>:
            <button className={`btn btn-outline-primary btn-sm ${styles.selectButton}`} onClick={() => this.props.switch(item.alias)}>
              {t('account.select')}
            </button>
          }
        </td>
      </tr>
    )
  }
}

export default withNamespaces('translations') (ListItem)
