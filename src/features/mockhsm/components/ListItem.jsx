import React from 'react'
import { Link } from 'react-router'
import {withNamespaces} from 'react-i18next'
import styles from 'features/shared/components/TableList/TableList.scss'

class ListItem extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {item, t} = this.props
    const titles = t('key.formTitle', { returnObjects: true })

    return (
      <div className={styles.tr}>
        <div className={`${styles.td} ${styles.full}`}>
          <div className={styles.label}>{titles[0]}</div>
          <div className={styles.value}>{item.alias}</div>
        </div>
        <div className={`${styles.td} ${styles.full}`}>
          <div className={styles.label}>{titles[1]}</div>
          <div className={styles.value}>{item.xpub}</div>
        </div>
        <div style={{ position: 'absolute', top: '24px', right: '24px' }}>
          <Link to={`/keys/${item.id}`}>
            {t('form.more')} →
          </Link>
        </div>
      </div>
    )
    // return(
    //   <tr>
    //     <td>{item.alias}</td>
    //     <td><code>{item.xpub}</code></td>
    //     <td><Link to={`/keys/${item.id}`}>
    //       {t('form.more')}
    //     </Link></td>
    //   </tr>
    // )
  }
}

export default withNamespaces('translations') (ListItem)
