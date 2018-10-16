import React from 'react'
import { copyToClipboard } from 'utility/clipboard'
import styles from './CopyableBlock.scss'
import {withNamespaces} from 'react-i18next'

class CopyableBlock extends React.Component {
  copyClick() {
    copyToClipboard(this.props.value)
  }

  render() {
    return (
      <div className={styles.main}>
        <pre className={styles.pre}>{this.props.value}</pre>
        <div className={styles.copyButton}>
          <button className='btn btn-default btn-sm' onClick={this.copyClick.bind(this)}>
            { this.props.t('account.copyClipboard') }</button>
        </div>
      </div>
    )
  }
}

export default withNamespaces('translations') (CopyableBlock)
