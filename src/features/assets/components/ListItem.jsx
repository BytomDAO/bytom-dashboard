import React from 'react'
import { Link } from 'react-router'
import { withNamespaces } from 'react-i18next'
import styles from 'features/shared/components/TableList/TableList.scss'

class ListItem extends React.Component {
  render() {
    const { item, t } = this.props
    const titles = t('asset.formTitle', { returnObjects: true })

    return (
      <div className={styles.tr}>
        <div className={styles.td} style={{ minWidth: '150px' }}>
          <span className={styles.label}>{titles[0]}</span>
          <span className={styles.value}>{item.alias || '-'}</span>
        </div>
        <div className={styles.td}>
          <span className={styles.label}>{titles[1]}</span>
          <span className={`${styles.value} ${styles.break}`} style={{ maxWidth: '400px' }}>{item.id}</span>
        </div>
        <div className={`${styles.td} ${styles.right}`} style={{ minWidth: '70px' }}>
          <Link className={styles.link} to={`/assets/${item.id}`}>{t('commonWords.viewDetails')}</Link>
        </div>
      </div>
    )
    // return (
    //   <tr>
    //     <td>{item.alias || '-'}</td>
    //     <td>
    //       <code>{item.id}</code>
    //     </td>
    //     <td>
    //       <Link to={`/assets/${item.id}`}>{t('commonWords.viewDetails')} →</Link>
    //     </td>
    //   </tr>
    // )
  }
}

export default withNamespaces('translations')(ListItem)
