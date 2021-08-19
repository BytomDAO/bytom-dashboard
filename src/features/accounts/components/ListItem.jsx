import React from 'react'
import { Link } from 'react-router'
import { withNamespaces } from 'react-i18next'
import { Button } from 'react-bootstrap'
// import styles from './ListItem.scss'
import styles from 'features/shared/components/TableList/TableList.scss'
import { chainClient } from 'utility/environment'
import { ellText } from 'utility/string'

class ListItem extends React.Component {
  componentWillMount() {
    this.state = {
      address: ''
    }

    chainClient().accounts.listAddresses({ accountId: this.props.item.id }).then(res => {
      if (res.status === 'success' && res.data.length) {
        this.setState({
          address: res.data[0].address
        })
      }
    })
  }

  render() {
    const item = this.props.item
    const t = this.props.t
    const signStuct = `${item.quorum} / ${item.xpubs.length}`

    const titles = t('account.formTitle', { returnObjects: true })
    return (
      <div className={styles.tr}>
        <div className={styles.td}>
          <div className={styles.label}>{titles[0]}</div>
          <div className={styles.value}>
            <Link to={`/accounts/${item.id}`}>{item.alias || '-'}</Link>
          </div>
        </div>
        <div className={styles.td}>
          <div className={styles.label}>{titles[1]}</div>
          <div className={styles.value}>{item.id}</div>
        </div>
        <div className={styles.td}>
          <div className={styles.label}>{titles[2]}</div>
          <div className={styles.value}>{signStuct}</div>
        </div>
        <div className={styles.td}>
          <div className={styles.label}>{titles[3]}</div>
          <div className={styles.value} title={this.state.address}>{this.state.address ? ellText(this.state.address, 12) : '-'}</div>
        </div>
        <div className={`${styles.td} ${styles.right}`}>
          <div className={styles.value}>
            {item.isUsed ? (
              <Button className="btn-large" disabled>
                {t('account.selected')}
              </Button>
            ) : (
              // <button className={`btn btn-default btn-sm ${styles.selectButton} ${styles.buttonDisable}`} disabled>

              // </button>
              <Button className="btn btn-primary btn-ghost btn-large" onClick={() => this.props.switch(item.alias)}>
                {t('account.select')}
              </Button>
              // <button
              //   className={`btn btn-outline-primary btn-sm ${styles.selectButton}`}
              //   onClick={() => this.props.switch(item.alias)}
              // >
              //   {t('account.select')}
              // </button>
            )}
          </div>
        </div>
      </div>
    )

    // return (
    //   <tr className={styles.tr}>
    //     <td>
    //       <Link to={`/accounts/${item.id}`}>{item.alias || '-'}</Link>
    //     </td>
    //     <td>
    //       <code>{item.id}</code>
    //     </td>
    //     <td>
    //       <code>{signStuct}</code>
    //     </td>
    //     <td>
    //       {item.isUsed ? (
    //         <button className={`btn btn-default btn-sm ${styles.selectButton} ${styles.buttonDisable}`} disabled>
    //           {t('account.selected')}
    //         </button>
    //       ) : (
    //         <button
    //           className={`btn btn-outline-primary btn-sm ${styles.selectButton}`}
    //           onClick={() => this.props.switch(item.alias)}
    //         >
    //           {t('account.select')}
    //         </button>
    //       )}
    //     </td>
    //   </tr>
    // )
  }
}

export default withNamespaces('translations')(ListItem)
